$(document).ready(function () {
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

  function clampValue(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function padValue(value, length) {
    return String(value).padStart(length, '0');
  }

  function parseTime(row) {
    const hours = clampValue(parseInt($(row).find('.hours').val()) || 0, 0, 999);
    const minutes = clampValue(parseInt($(row).find('.minutes').val()) || 0, 0, 59);
    const seconds = clampValue(parseInt($(row).find('.seconds').val()) || 0, 0, 59);
    const milliseconds = clampValue(parseInt($(row).find('.milliseconds').val()) || 0, 0, 999);

    return (hours * 3600 + minutes * 60 + seconds) * 1000 + milliseconds;
  }

  function formatTime(ms) {
    const hours = Math.floor(ms / 3600000);
    ms %= 3600000;
    const minutes = Math.floor(ms / 60000);
    ms %= 60000;
    const seconds = Math.floor(ms / 1000);
    const milliseconds = ms % 1000;

    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(milliseconds).padStart(3, '0')}`;
  }

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
