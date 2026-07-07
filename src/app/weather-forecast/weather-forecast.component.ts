import { Component, inject, OnInit,  ChangeDetectorRef, } from '@angular/core';
import { WeatherForecastService } from '../../service/weatherForecast.service';
import { SkyAgGridModule, SkyAgGridService, SkyCellType} from '@skyux/ag-grid';
import { AgGridModule } from 'ag-grid-angular';
import { CommonModule } from '@angular/common';
import { SkyDescriptionListModule } from '@skyux/layout';
import { SkyIconModule } from '@skyux/indicators';
import { SkyPagingModule, SkyRepeaterModule } from '@skyux/lists';
import { ColDef, GridApi, GridOptions,  GridReadyEvent} from 'ag-grid-community';
import { SkyInputBoxModule, SkyRadioModule} from '@skyux/forms';
import { SkyFluidGridModule } from '@skyux/layout';
import { FormBuilder, FormControl, FormGroup, FormsModule, Validators, ReactiveFormsModule, AbstractControl} from '@angular/forms';
import { SkyActionButtonModule } from '@skyux/layout';
import { SkyModalModule } from '@skyux/modals';
import { SkyAlertModule } from '@skyux/indicators';
import { Subscription, Subject} from 'rxjs';
import { filter, map,distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { SkyDateRangeCalculation, SkyDateRangePickerModule } from '@skyux/datetime';
import { Item } from '../../interfaces/item';

@Component({
  standalone: true,
  selector: 'app-weather-forecast',
  templateUrl: './weather-forecast.component.html',
  styleUrl: './weather-forecast.component.scss',
  providers:[WeatherForecastService],
  imports: [ AgGridModule,
             SkyAgGridModule, 
             SkyInputBoxModule, 
             SkyAlertModule, 
             SkyRadioModule,
             SkyFluidGridModule, 
             FormsModule, 
             ReactiveFormsModule,
             SkyActionButtonModule,
             SkyModalModule,
             CommonModule,
             SkyDescriptionListModule,
             SkyPagingModule,
             SkyRepeaterModule,
             SkyDateRangePickerModule,
             SkyIconModule
            ]
})

export class WeatherForecastComponent implements OnInit {
  
  // Variable Declarations... 
  protected weatherForecastList : any;
  protected isShowGrid = false;
  protected inputLatitude : any; 
  protected inputLongitude : any; 
  protected inputModeOption : any; 
  protected inputWeatherDateRangeValue: any;  
  protected inputWeatherDateRangeStart : any; 
  protected inputWeatherDateRangeEnd : any; 
  protected inputTemperatureUnitOption : any; 
  protected inputPrecipitationUnitOption : any; 
  protected currentLocationLat : any;
  protected currentLocationLong : any;
  protected currentPage : any;
  protected dateFormat: string | undefined;
  protected formGroup: FormGroup<{
    latitude: FormControl<string | null>;
    longitude: FormControl<string | null>;  
    weatherDateRangeControl : FormControl<Date>;  
    modeOptionControl: FormControl<string | null>;  
    temparatureUnitsControl: FormControl<string | null>;  
    precipitationUnitsControl: FormControl<string | null>;  
  }>;  
  protected isShowAlert = false;
  protected isShowAlertForDateRange = false;
  #gridApi: GridApi | undefined;
  protected gridOptions: GridOptions;

  #subscriptions = new Subscription();
  #ngUnsubscribe = new Subject<void>();

  // Variable Assignments
  protected readonly pageSize = 7;
  protected submitted = false;
  protected modeOptions: Item[] = [
    { name: 'Daily', value: 'daily', disabled: false },
    { name: 'Hourly', value: 'hourly', disabled: false }    
  ]; 

  protected temparatureUnitsOptions: Item[] = [
    { name: '°C', value: 'degreecelisus', disabled: false },
    { name: '°F', value: 'degreefahrenheit', disabled: false }    
  ]; 

  protected precipitationUnitsOptions: Item[] = [
    { name: 'mm', value: 'precipitationunitmm', disabled: false },
    { name: 'inch', value: 'precipitationunitinch', disabled: false }    
  ]; 

  protected get reactiveRange(): AbstractControl | null {
    return this.formGroup.get('weatherDateRange');
  }

  #columnDefs: ColDef[] = [
    {
      field: 'date',
      headerName: 'Date',
      type: SkyCellType.Text,      
    },
    {
      field: 'highTemperature',
      headerName: 'High Temperature',
      type: SkyCellType.Text  
    },
    {
      field: 'lowTemperature',
      headerName: 'Low Temperature',
      type: SkyCellType.Text,  
    },
    {
      field: 'highApparentTemperature',
      headerName: 'High Apparent Temperature',
      type: SkyCellType.Text 
    },
    {
      field: 'lowApparentTemperature',
      headerName: 'Low Apparent Temperature',
      type: SkyCellType.Text 
    },
    {
      field: 'precipitationProbablity',
      headerName: 'Precipitation Probablity',
      type: SkyCellType.Text 
    },
    {
      field: 'precipitation',
      headerName: 'Precipitation',
      type: SkyCellType.Text 
    },
    {
      field: 'averageRelativeHumidity',
      headerName: 'Avg Relative Humidity',
      type: SkyCellType.Text 
    },
  ];  

  // Service Injections
  readonly #activatedRoute = inject(ActivatedRoute);
  readonly #agGridSvc = inject(SkyAgGridService);
  readonly #changeDetectorRef = inject(ChangeDetectorRef);
  readonly #router = inject(Router);  

  constructor (private _weatherForecastService : WeatherForecastService)  {
    
    const gridOptions: GridOptions = {
      columnDefs: this.#columnDefs,
      onGridReady: (gridReadyEvent): void => this.onGridReady(gridReadyEvent),
      rowSelection: 'single',   
      pagination: true,
      suppressPaginationPanel: true,
      paginationPageSize: this.pageSize,       
    };

    this.gridOptions = this.#agGridSvc.getGridOptions({
      gridOptions,
    }); 

    this.formGroup = inject(FormBuilder).group({
      latitude: new FormControl('',Validators.required),
      longitude: new FormControl('', Validators.required),   
      weatherDateRangeControl: new FormControl(),
      modeOptionControl: this.modeOptions[0].value,
      temparatureUnitsControl : this.temparatureUnitsOptions[0].value,
      precipitationUnitsControl : this.precipitationUnitsOptions[0].value
    });
  } 

  // Lifecycle Hooks... 
  public ngOnInit(): void {
    this.dateFormat = "YYYY-MM-DD";   
    
    this.#subscriptions.add(
      this.#activatedRoute.queryParamMap
        .pipe(map((params) => params.get('page') || '1'))
        .subscribe((page) => {
          this.currentPage = Number(page);
          this.#gridApi?.paginationGoToPage(this.currentPage - 1);
          this.#changeDetectorRef.detectChanges();
        }),    
    );

    this.#subscriptions.add(
      this.#router.events
        .pipe(filter((event) => event instanceof NavigationEnd))
        .subscribe(() => {
          const page = this.#activatedRoute.snapshot.paramMap.get('page');

          if (page) {
            this.currentPage = Number(page);
          }

          this.#gridApi?.paginationGoToPage(this.currentPage - 1);
          this.#changeDetectorRef.detectChanges();
        }),
    );

    this.reactiveRange?.statusChanges
    .pipe(distinctUntilChanged(), takeUntil(this.#ngUnsubscribe))
    .subscribe((status) => {
      console.log(
        'Date range status change:',
        status,
        this.reactiveRange?.errors,
      );
    });

    // Watch for value changes.
    this.reactiveRange?.valueChanges
      .pipe(distinctUntilChanged(), takeUntil(this.#ngUnsubscribe))
      .subscribe((value: SkyDateRangeCalculation) => {
        console.log('Date range value change:', value);
      });
  }

  public ngOnDestroy(): void {
    this.#subscriptions.unsubscribe();
    this.#ngUnsubscribe.next();
    this.#ngUnsubscribe.complete();
  }

  // Grid callbacks... 
  public onGridReady(gridReadyEvent: GridReadyEvent): void {
    this.#gridApi = gridReadyEvent.api;
    this.#gridApi.sizeColumnsToFit();   
    this.#gridApi.paginationGoToPage(this.currentPage - 1);
  }

  // Pagination callbacks. 
  protected onPageChange(page: number): void {
    this.#router
      .navigate(['.'], {
        relativeTo: this.#activatedRoute,
        queryParams: { page: page.toString(10) },
        queryParamsHandling: 'merge',
      })
      .then();
  }

  //User events... 
  protected loadWeatherData(): void {

    if(this.formGroup.controls.latitude.status == "INVALID" || this.formGroup.controls.longitude.status == "INVALID") {
        this.isShowAlert = true;
    }
    else if(this.formGroup.controls.weatherDateRangeControl.touched == false)
      {this.isShowAlertForDateRange = true;}
    else
    {   
      this.currentPage = 1;
      this.isShowGrid = true; 
      this.inputLatitude = this.formGroup.controls.latitude.value;
      this.inputLongitude = this.formGroup.controls.longitude.value;
      this.inputModeOption = this.formGroup.controls.modeOptionControl.value;
      this.inputTemperatureUnitOption = this.formGroup.controls.temparatureUnitsControl.value;
      this.inputPrecipitationUnitOption = this.formGroup.controls.precipitationUnitsControl.value;
      this.inputWeatherDateRangeValue = this.formGroup.controls.weatherDateRangeControl.value;
      this.inputWeatherDateRangeStart =  this.inputWeatherDateRangeValue.startDate.toLocaleDateString('en-CA');   
      this.inputWeatherDateRangeEnd =  this.inputWeatherDateRangeValue.endDate.toLocaleDateString('en-CA');

      this._weatherForecastService.getWeatherForecast(this.inputLatitude,
        this.inputLongitude, 
        this.inputModeOption, 
        this.inputTemperatureUnitOption,
        this.inputPrecipitationUnitOption,
        this.inputWeatherDateRangeStart,
        this.inputWeatherDateRangeEnd)
      .subscribe(response=>{this.weatherForecastList = response;})      
    }
  }  

  protected getCurrentLocation() {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            if (position) {
              console.log(
                'Latitude: ' +
                  position.coords.latitude +
                  'Longitude: ' +
                  position.coords.longitude
              );
              let lat = position.coords.latitude;
              let lng = position.coords.longitude;
              this.formGroup.patchValue({
                latitude : lat.toString(),
                longitude : lng.toString()

              })
          
              const location = {
                lat,
                lng,
              };
              resolve(location);
            }
          },
          (error) => console.log(error)
        );
      } else {
        reject('Geolocation is not supported by this browser.');
      }
    });
  }
}
