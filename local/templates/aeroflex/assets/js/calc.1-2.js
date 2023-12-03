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
        
          $calc.find($('[name="pipe-width"]')).val(($('[name="diameter_out"]').val() - $('[name="diameter_in"]').val()) / 2)
          $calc.find('[name="diameter_in"]').removeClass('error')
          $calc.find('[name="diameter_out"]').removeClass('error')
          $calc.find($('[name="pipe-width"]')).removeClass('error')

      } else {
          $calc.find('[name="diameter_in"], [name="diameter_out"]').prop('readonly', false);
      }
  });

  $('[name="diameter_out"]').on('change', function() {
    const $calc = $('.calc');
    
    const diameterIn = $calc.find('[name="diameter_in"]').val()
    const diameterOut = $(this).val()

    if (diameterIn && diameterOut) {
      $calc.find($('[name="pipe-width"]')).val((diameterOut - diameterIn) / 2)
    }
  })

  $('[name="diameter_in"]').on('change', function() {
    const $calc = $('.calc');
    
    const diameterOut = $calc.find('[name="diameter_out"]').val()
    const diameterIn = $(this).val()

    if (diameterIn && diameterOut) {
      $calc.find($('[name="pipe-width"]')).val((diameterOut - diameterIn) / 2)
    }
  })

  $('[name="material-insulting"]').on('change', function() {
    const $calc = $('.calc');

    if ($(this).val() === 'water') {

      $calc.find($('[name="coolant-density"]')).val(1000)
      $calc.find($('[name="coolant-heat-capacity"]')).val(4.187)
      $calc.find($('[name="coolant-density"]')).removeClass('error')
      $calc.find($('[name="coolant-heat-capacity"]')).removeClass('error')
      $calc.find('[name="coolant-density"], [name="coolant-heat-capacity"]').prop('readonly', true);
    } else {
      $calc.find($('[name="coolant-density"]')).val('')
      $calc.find($('[name="coolant-heat-capacity"]')).val('')
      $calc.find('[name="coolant-density"], [name="coolant-heat-capacity"]').prop('readonly', false);
    }
  })

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
  
  $('[name="region"]').on('change', function () {
    const $calc = $('.calc');

    $temperature = $calc.find('[name="region"] option:selected').data('temperature');
    
    $calc.find('.temperature_out').val($temperature);  
  });

  $(window).on('calc_changes', function () {
      let
          $calc = $('.calc_test'),
          $region_select = $calc.find('[name="region"]').closest('.calc__select'),
          $region = $calc.find('[name="region"] option:selected');
      

      $calc.find('.calc__result').removeClass('active');

      if (isNaN(parseFloat($region.data('temperature')))) {
          $region_select.addClass('error');
      } else {
          $region_select.removeClass('error');
      }
  });

  $('.calc_test ._result').on('click', function () {
      let
          $calc = $(this).closest('.calc_test'),
          $region = $calc.find('[name="region"] option:selected'),
          $position = $calc.find('[name="position"]:checked'),
          $indoor = $calc.find('[name="indoor"]:checked'),
          $supportType = $calc.find('[name="support_type"]:checked'),
          $flat = $calc.find('[name="flat"]:checked'),
          $diameter_in = $calc.find('[name="diameter_in"]'),
          $diameter_out = $calc.find('[name="diameter_out"]'),
          $temperatureOut = $calc.find('.temperature_out'),
          $material = $calc.find('[name="material"] option:selected'),
          $pipe = $calc.find('[name="pipe"] option:selected'),
          $result = $calc.find('.calc__result'),
          $approx = $calc.find('.approx'),
          $heat_coefficient = $calc.find('[name="heat_coefficient"]'),
          $pipeWidth = $calc.find('[name="pipe-width"]'),
          $pipeMaterialDensity = $calc.find('[name="pipe-material-density"]'),
          $materialHeatCapacity = $calc.find('[name="material-heat-capacity"]'),
          $startCarrierTemperature = $calc.find('[name="start-carrier-temperature"]'),
          $startCoolantFrostTemperature = $calc.find('[name="start-coolant-frost-temperature"]'),
          $permissibleIceContent = $calc.find('[name="permissible-ice-content"]'),
          $coolantDensity = $calc.find('[name="coolant-density"]'),
          $coolantHeatCapacity = $calc.find('[name="coolant-heat-capacity"]'),
          $stopTime = $calc.find('[name="stop-time"]');
          
      $approx.closest('.calc__row').addClass('hidden');

      $heat_coefficient.attr('placeholder', '');
      
      if (isNaN(parseFloat($region.data('heat')))) {
          $region.closest('.calc__select').addClass('error');
          return;
      }


      if (isNaN(parseFloat($diameter_in.val()))) {
        $diameter_in.addClass('error');
      }

      if (isNaN(parseFloat($diameter_out.val()))) {
        $diameter_out.addClass('error');
      }

      if (isNaN(parseFloat($temperatureOut.val()))) {
        $temperatureOut.addClass('error');
      }

      if (isNaN(parseFloat($stopTime.val()))) {
        $stopTime.addClass('error');
      }

      if (isNaN(parseFloat($coolantHeatCapacity.val()))) {
        $coolantHeatCapacity.addClass('error');
      }

      if (isNaN(parseFloat($coolantDensity.val()))) {
        $coolantDensity.addClass('error');
      }

      if (isNaN(parseFloat($permissibleIceContent.val()))) {
        $permissibleIceContent.addClass('error');
      }

      if (isNaN(parseFloat($startCoolantFrostTemperature.val()))) {
        $startCoolantFrostTemperature.addClass('error');
      }

      if (isNaN(parseFloat($startCarrierTemperature.val()))) {
        $startCarrierTemperature.addClass('error');
      }

      // Main
      const
          material = parseInt($material.val(), 10),
          diameterIn = parseFloat($diameter_in.val().replace(/,/, '.')),
          diameterOut = parseFloat($diameter_out.val().replace(/,/, '.')),
          temperatureOut = parseFloat($temperatureOut.val().replace(/,/, '.')),
          isIndoor = $indoor.val() === 'close',
          isFlat = $flat.val() === 'flat',
          isVertical = $position.val() === 'vertical',
          isSupportTypeMoving = $supportType.val() === 'moving',
          region = $region.data('type'),
          emission = parseInt($pipe.val(), 10),
          pipeWidth = parseFloat($pipeWidth.val().replace(/,/, '.')),
          pipeMaterialDensity = parseFloat($pipeMaterialDensity.val().replace(/,/, '.')),
          materialHeatCapacity = parseFloat($materialHeatCapacity.val().replace(/,/, '.')),
          startCarrierTemperature = parseFloat($startCarrierTemperature.val().replace(/,/, '.')),
          startCoolantFrostTemperature = parseFloat($startCoolantFrostTemperature.val().replace(/,/, '.')),
          permissibleIceContent = parseFloat($permissibleIceContent.val().replace(/,/, '.')),
          coolantDensity = parseFloat($coolantDensity.val().replace(/,/, '.')),
          coolantHeatCapacity = parseFloat($coolantHeatCapacity.val().replace(/,/, '.')),
          isPipeMetal = $pipe.data('material') === 'metal';
          stopTime = parseFloat($stopTime.val().replace(/,/, '.'));


      AeroflexCalc.init();

      $heat_coefficient.attr('placeholder', AeroflexCalc.getThermalLossCoefficient(isFlat, isVertical, false, emission));
      
      // Extended
      const
          heat_coefficient = parseFloat($heat_coefficient.val().replace(/,/, '.'));
          // density = parseFloat($density.val().replace(/,/, '.'));
        
      AeroflexCalc.init({
          heat_coefficient
          // density
      });

      //$density.attr('placeholder', AeroflexCalc.getSurfaceHeatFlowDensity(diameterIn, temperatureIn, isIndoor, hours, isFlat, region).toFixed(4))

      if (isNaN(diameterIn)) {
          $diameter_in.addClass('error');
      }

      if (isNaN(diameterOut)) {
          $diameter_out.addClass('error');
      }

      if (isNaN(temperatureOut)) {
          $temperatureOut.addClass('error');
      }
      
      
      if (!$calc.find('.error').length && typeof AeroflexCalc !== 'undefined') {
        
        const getMetalKoef = () => {

          if (!isPipeMetal) {
            return 1.7
          }

          if (!isSupportTypeMoving) {
            return 1.05
          }

          if (diameterOut >= 150) {
            return 1.15
          }

          return 1.2
        }

        let heatCoefficientAdditionsLosses = getMetalKoef();
        console.log({ heatCoefficientAdditionsLosses, temperatureOut })

          let
              depth = AeroflexCalc.getInsulationDepthForLiquidFrost(
                material,
                diameterIn,
                diameterOut,
                temperatureOut,
                isIndoor,
                isFlat,
                isVertical,
                region,
                emission,
                pipeWidth,
                pipeMaterialDensity,
                materialHeatCapacity,
                heatCoefficientAdditionsLosses,
                startCarrierTemperature,
                startCoolantFrostTemperature,
                permissibleIceContent,
                coolantDensity,
                coolantHeatCapacity,
                stopTime
              );

          $result.addClass('active');

          $('.calc__result').addClass('active');
          $('.otvet').val(!depth ? 'По вопросам - calc@aeroflex-russia.ru' : depth.toFixed(2));
      }
  });
});
