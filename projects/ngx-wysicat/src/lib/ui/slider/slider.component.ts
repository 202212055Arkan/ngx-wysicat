import {ChangeDetectionStrategy, Component, computed, input, linkedSignal, OnInit, output} from '@angular/core';

@Component({
  selector: 'nw-range-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RangeSliderComponent implements OnInit {
  public min = input(0);
  public max = input(100);
  public value = input(50);
  public step = input(1);
  public readonly valueChange = output<number>();

  protected readonly internalValue = linkedSignal(() => this.value());
  protected readonly progressWidth = computed(() => {
    const minVal = this.min();
    const maxVal = this.max();
    const val = this.internalValue();
    const percentage = ((val - minVal) / (maxVal - minVal)) * 100;
    return `${percentage}%`;
  });

  ngOnInit(): void {
    this.internalValue.set(this.value());
  }

  onInputChange(event: Event): void {
    const i = event.target as HTMLInputElement;
    this.internalValue.set(parseFloat(parseFloat(i.value).toFixed(2)));
    this.valueChange.emit(this.internalValue());
  }
}
