$(function() {
  if (typeof $.fn.select2 !== 'undefined') {
      $('.js-select-single').select2({
          theme: "classic",
          width: '100%',
          language: 'ru'
      });

      $('.js-select-radio').select2({
          theme: "classic",
          width: '100%',
          language: 'ru',
          minimumResultsForSearch: Infinity
      });

      $('#diameter option').prop('disabled', true);
      $('#diameter optgroup').prop('disabled', true);
      $('#diameter_custom').prop('disabled', false);
      $('#diameter_custom option').prop('disabled', false);
  }

  $('.calc_test input, .calc_test select').on('change', function () {
      $(this).removeClass('error');
      $(window).trigger('calc_changes');
  });

  $('[name="diameter_type"]').on('change', function() {
      $('#diameter option').prop('disabled', true);
      $('#diameter optgroup').prop('disabled', true);
      $('#'+$(this).val()).prop('disabled', false);
      $('#'+$(this).val()+' option').prop('disabled', false);
      $('#'+$(this).val()+' option').eq(0).prop('selected', true);
      $('#diameter').trigger('change');
  });

  $('[name="diameter"]').on('change', function() {
      const $calc = $('.calc');

      if ($(this).val()) {
          $calc.find('[name="diameter_in"]').val($(this).val());
          $calc.find('[name="diameter_out"]').val($(this).find('option:selected').data('dh'));
          $calc.find('[name="diameter_in"], [name="diameter_out"]').prop('readonly', true);
      } else {
          $calc.find('[name="diameter_in"], [name="diameter_out"]').prop('readonly', false);
      }
  });

  $('[name="flat"]').on('change', function() {
      const $calc = $('.calc');

      if ($(this).val() === 'flat') {
          $calc.find('[name="diameter"]').prop('disabled', true);
          $calc.find('[name="diameter_in"]').prop('readonly', true);
          $calc.find('[name="diameter_out"]').prop('readonly', true);
      } else {
          $calc.find('[name="diameter"]').prop('disabled', false);
          $('[name="diameter"]').trigger('change');
      }
  });

  $(window).on('calc_changes', function () {
      let
          $calc = $('.calc_test'),
          $region_select = $calc.find('[name="region"]').closest('.calc__select'),
          $region = $calc.find('[name="region"] option:selected'),
          indoor = $calc.find('input[name="indoor"]:checked').val(),
          $temperatureOut = $calc.find('.temperature_out');
          // hours = $calc.find('input[name="hours"]:checked').val();

      $calc.find('.calc__result').removeClass('active');

      if (isNaN(parseFloat($region.data('temperature')))) {
          $region_select.addClass('error');
      } else {
          $region_select.removeClass('error');
      }

      // $temperatureOut.prop('readonly', true);
      // $temperatureOut.val(hours === 'heat' ? $region.data('heat') : $region.data('temperature'));
      // if (indoor === 'close') {
      //     $temperatureOut.val(20);
      //     $temperatureOut.prop('readonly', false);
      // }
  });

  $('.calc_test ._result').on('click', function () {
      let
          $calc = $(this).closest('.calc_test'),
          $region = $calc.find('[name="region"] option:selected'),
          $position = $calc.find('[name="position"]:checked'),
          $indoor = $calc.find('[name="indoor"]:checked'),
          // $hours = $calc.find('[name="hours"]:checked'),
          $flat = $calc.find('[name="flat"]:checked'),
          $diameter_in = $calc.find('[name="diameter_in"]'),
          $diameter_out = $calc.find('[name="diameter_out"]'),
          $temperatureIn = $calc.find('.temperature_in'),
          $temperatureOut = $calc.find('.temperature_out'),
          $material = $calc.find('[name="material"] option:selected'),
          $pipe = $calc.find('[name="pipe"] option:selected'),
          $result = $calc.find('.calc__result'),
          $approx = $calc.find('.approx'),
          $heat_coefficient = $calc.find('[name="heat_coefficient"]');
          $surfaceInsulationTemperature = $calc.find('.surface_insulation_temperature');

      $approx.closest('.calc__row').addClass('hidden');

      $heat_coefficient.attr('placeholder', '');

      if (isNaN(parseFloat($region.data('heat')))) {
          $region.closest('.calc__select').addClass('error');
          return;
      }

      // Main
      const
          material = parseInt($material.val(), 10),
          diameterIn = parseFloat($diameter_in.val().replace(/,/, '.')),
          diameterOut = parseFloat($diameter_out.val().replace(/,/, '.')),
          temperatureIn = parseFloat($temperatureIn.val().replace(/,/, '.')),
          temperatureOut = parseFloat($temperatureOut.val().replace(/,/, '.')),
          isIndoor = $indoor.val() === 'close',
          isFlat = $flat.val() === 'flat',
          isVertical = $position.val() === 'vertical',
          region = $region.data('type'),
          //hours = $hours.val() === 'heat' ? parseFloat($region.data('heat_days')) * 24 : parseFloat($hours.val()),
          emission = parseInt($pipe.val(), 10),
          surfaceInsulationTemperature = parseFloat($surfaceInsulationTemperature.val().replace(/,/, '.'));
      AeroflexCalc.init();

      $heat_coefficient.attr('placeholder', AeroflexCalc.getThermalLossCoefficient(isFlat, isVertical, isIndoor, emission));

      // Extended
      const
          heat_coefficient = parseFloat($heat_coefficient.val().replace(/,/, '.'));
          //density = parseFloat($density.val().replace(/,/, '.'));

      AeroflexCalc.init({
          heat_coefficient
      });

      //$density.attr('placeholder', AeroflexCalc.getSurfaceHeatFlowDensity(diameterIn, temperatureIn, isIndoor, hours, isFlat, region).toFixed(4))
      if (!isFlat) {
        if (isNaN(diameterIn)) {
          $diameter_in.addClass('error');
        }

        if (isNaN(diameterOut)) {
          $diameter_out.addClass('error');
        }
      } 
      

      if (isNaN(temperatureIn)) {
          $temperatureIn.addClass('error');
      }

      if (isNaN(temperatureOut)) {
          $temperatureOut.addClass('error');
      }
      console.log('error', $calc.find('.error'))
      console.log('AeroflexCalc', typeof AeroflexCalc !== 'undefined')
      console.log(!$calc.find('.error').length && typeof AeroflexCalc !== 'undefined')

      if (!$calc.find('.error').length && typeof AeroflexCalc !== 'undefined') {
        console.log('conditional')
        console.log(AeroflexCalc)
        let depth = AeroflexCalc.getInsulationDepthWithSurfaceTemperature(material, diameterIn, diameterOut, temperatureIn, temperatureOut, isIndoor, isFlat, isVertical, region, emission, surfaceInsulationTemperature);
        console.log('depth', depth)
          $result.addClass('active');

          $('.calc__result').addClass('active');
          $('.otvet').val(depth.toFixed(2));
      }
  });
});