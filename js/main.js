$(document).ready(function () {
  // Initialize rows

  const ROWS = 4;
  const timerows = $('#time-rows');

  const row = `<div class="time-row">
    <input type="number" class="time-input hours" placeholder="HH" min="0" max="999"> : 
    <input type="number" class="time-input minutes" placeholder="MM" min="0" max="59"> : 
    <input type="number" class="time-input seconds" placeholder="SS" min="0" max="59">.
    <input type="number" class="time-input milliseconds" placeholder="mmm" min="0" max="999">
    <button class="remove-row">Remove</button>
  </div>`

  for (let i = 0; i < ROWS; i++) {
    timerows.append(row);
  }

  /**
   * Clamps a given value between a specified minimum and maximum range.
   *
   * @param {number} value - The value to be clamped.
   * @param {number} min - The minimum allowable value.
   * @param {number} max - The maximum allowable value.
   * @returns {number} - The clamped value, constrained within the min and max range.
   */
  function clampValue(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  /**
   * Pads a given value with leading zeros to ensure it reaches a specified length.
   *
   * @param {number|string} value - The value to be padded.
   * @param {number} length - The desired length of the resulting string.
   * @returns {string} - The padded string representation of the value.
   */
  function padValue(value, length) {
    return String(value).padStart(length, '0');
  }

  /**
   * Parses the time values from a given row element and converts them into total milliseconds.
   *
   * @param {HTMLElement} row - The DOM element containing time input fields.
   * @returns {number} - The total time in milliseconds calculated from the input values.
   */
  function parseTime(row) {
    const hours = clampValue(parseInt($(row).find('.hours').val()) || 0, 0, 999);
    const minutes = clampValue(parseInt($(row).find('.minutes').val()) || 0, 0, 59);
    const seconds = clampValue(parseInt($(row).find('.seconds').val()) || 0, 0, 59);
    const milliseconds = clampValue(parseInt($(row).find('.milliseconds').val()) || 0, 0, 999);

    return (hours * 3600 + minutes * 60 + seconds) * 1000 + milliseconds;
  }

  /**
   * Converts a time duration from milliseconds into a formatted string.
   *
   * @param {number} ms - The time duration in milliseconds.
   * @returns {string} - The formatted time string in "HH:MM:SS.mmm" format.
   */
  function formatTime(ms) {
    const hours = Math.floor(ms / 3600000);
    ms %= 3600000;
    const minutes = Math.floor(ms / 60000);
    ms %= 60000;
    const seconds = Math.floor(ms / 1000);
    const milliseconds = ms % 1000;

    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(milliseconds).padStart(3, '0')}`;
  }

  // Listeners

  $('#add-row').click(function () {
    timerows.append(row);
  });

  timerows.on('click', '.remove-row', function () {
    $(this).closest('.time-row').remove();
  });

  timerows.on('input', '.time-input', function () {
    const min = parseInt($(this).attr('min'), 10) || 0;
    const max = parseInt($(this).attr('max'), 10) || Infinity;
    const value = parseInt($(this).val(), 10) || 0;

    const clampedValue = clampValue(value, min, max);

    let paddedValue;
    if ($(this).hasClass('milliseconds')) {
      paddedValue = padValue(clampedValue, 3);
    } else if ($(this).hasClass('minutes') || $(this).hasClass('seconds')) {
      paddedValue = padValue(clampedValue, 2);
    } else {
      paddedValue = clampedValue;
    }

    $(this).val(paddedValue);
  });

  $('#calculate').click(function () {
    let totalMilliseconds = 0;

    $('.time-row').each(function () {
      totalMilliseconds += parseTime(this);
    });

    $('#total-time').text(formatTime(totalMilliseconds));
  });
});
