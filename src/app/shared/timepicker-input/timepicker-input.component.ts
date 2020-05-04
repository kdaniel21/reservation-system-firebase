import {
  Component,
  OnInit,
  Input,
  OnDestroy,
  HostBinding,
  Optional,
  Self,
  ElementRef,
  forwardRef,
  Inject,
  Injector,
  DoCheck,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  NgControl,
  NG_VALUE_ACCESSOR,
  ControlValueAccessor,
} from '@angular/forms';
import { MatFormFieldControl } from '@angular/material/form-field';
import { Subject } from 'rxjs';
import { FocusMonitor } from '@angular/cdk/a11y';
import { coerceBooleanProperty } from '@angular/cdk/coercion';

interface Time {
  hours: number;
  minutes: number;
}

@Component({
  selector: 'app-timepicker',
  templateUrl: './timepicker-input.component.html',
  styleUrls: ['./timepicker-input.component.css'],
  providers: [
    {
      provide: MatFormFieldControl,
      useExisting: TimepickerInputComponent,
    },
  ],
  host: {
    '[id]': 'id',
    '[attr.aria-describedby]': 'describedBy',
  },
})
export class TimepickerInputComponent
  implements
    OnInit,
    OnDestroy,
    ControlValueAccessor,
    DoCheck,
    MatFormFieldControl<Time> {
  parts: FormGroup = this.fb.group({
    hours: this.fb.control(null, Validators.required),
    minutes: this.fb.control(null, Validators.required),
  });

  constructor(
    public fb: FormBuilder,
    public injector: Injector,
    private fm: FocusMonitor,
    private elRef: ElementRef<HTMLElement>
  ) {
    this.ngControl = this.injector.get(NgControl);
    if (this.ngControl != null) {
      this.ngControl.valueAccessor = this;
    }

    fm.monitor(elRef.nativeElement, true).subscribe((origin) => {
      this.focused = !!origin;
      this.stateChanges.next();
    });
  }

  ngOnInit() {
    // Set default time
    this.setTime();

    // Listen to changes
    this.parts.valueChanges.subscribe(() => {
      const val: Time = this.parts.value;
      this.onChange({ hours: val.hours, minutes: val.minutes });
    });
  }

  // CONTROL VALUE ACCESSOR
  touched = false;
  onChange = (_: any) => {};

  onTouched = () => {
    this.touched = true;
  };

  writeValue(value: Time): void {
    this.setTime({ hours: value.hours, minutes: value.minutes });
  }

  registerOnChange(fn: () => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  // MAT FORM FIELD
  stateChanges = new Subject<void>();
  ngControl: NgControl;
  controlType = 'timepicker';
  errorState = false;
  _value: Time;
  _placeholder: string;
  focused: boolean = false;
  _required: boolean = false;
  _disabled: boolean = false;
  static nextId = 0;

  get value(): Time {
    return this._value;
  }

  set value(value: Time) {
    this._value = value;
    this.setTime({ hours: value.hours, minutes: value.minutes });
    this.onChange(value);
    this.stateChanges.next();
  }

  ngDoCheck() {
    if (this.ngControl) {
      this.errorState = this.ngControl.invalid && this.ngControl.touched;
      this.stateChanges.next();
    }
  }

  @Input()
  get placeholder() {
    return this._placeholder;
  }

  set placeholder(plh) {
    this._placeholder = plh;
    this.stateChanges.next();
  }

  @Input()
  get required() {
    return this._required;
  }
  set required(req) {
    this._required = coerceBooleanProperty(req);
    this.stateChanges.next();
  }

  @Input()
  get disabled() {
    return this._disabled;
  }
  set disabled(dis) {
    this._disabled = coerceBooleanProperty(dis);
    this.stateChanges.next();
  }

  @HostBinding() id = `timepicker-input-${TimepickerInputComponent.nextId++}`;

  get empty() {
    return !this.parts.value.hours;
  }

  @HostBinding('class.floating')
  get shouldLabelFloat() {
    return !this.empty;
  }

  @HostBinding('attr.aria-describedby') describedBy = '';
  setDescribedByIds(ids: string[]) {
    this.describedBy = ids.join(' ');
  }

  onContainerClick(event: MouseEvent) {
    if ((event.target as Element).tagName.toLowerCase() != 'input') {
      this.elRef.nativeElement.querySelector('input').focus();
    }
  }

  // ACTIONS
  // Set time with leading zeros
  defaultTime = { hours: 1, minutes: 0 };
  setTime(time: Time = this.defaultTime) {
    const hours = String(time.hours < 10 ? '0' + time.hours : time.hours);
    const minutes = String(
      time.minutes < 10 ? '0' + time.minutes : time.minutes
    );

    this.parts.setValue({
      hours: hours,
      minutes: minutes,
    });
  }

  onChangeHours(action: string) {
    let hours = +this.parts.value.hours;

    const regex = /^[0-9]{1,2}$/;
    if (isNaN(hours) || !regex.test(String(hours))) {
      this.setTime();
      return;
    }

    // set hours
    if (action === 'plus') {
      hours = hours + 1;
    } else if (action === 'minus') {
      if (hours - 1 == -1) {
        hours = 0;
      } else {
        hours = hours - 1;
      }
    }

    this.setTime({ hours: hours, minutes: +this.parts.value.minutes });
  }

  onChangeMinutes(action: string) {
    let mins = +this.parts.value.minutes;

    const regex = /^[0-5]?\d$/g;
    if (isNaN(mins) || !regex.test(String(mins))) {
      this.setTime();
      return;
    }

    // Calculate fields (+hour change)
    if (action === 'plus') {
      if (mins + 5 >= 59) {
        mins = 0;
        this.onChangeHours('plus');
      } else {
        mins = mins + 5;
      }
    } else if (action === 'minus') {
      if (mins - 5 < 0) {
        mins = 55;
        this.onChangeHours('minus');
      } else {
        mins = mins - 5;
      }
    }

    this.setTime({ hours: +this.parts.value.hours, minutes: mins });
  }

  ngOnDestroy() {
    this.fm.stopMonitoring(this.elRef.nativeElement);
    this.stateChanges.complete();
  }
}
