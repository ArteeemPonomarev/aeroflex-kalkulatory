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

  $('[name="gas-pipe-type"]').on('change', function() {
      const $calc = $('.calc');

      if ($(this).val() === 'rectangular') {
        $calc.find('[name="gas-pipe-width"]').prop('disabled', false);
        $calc.find('[name="gas-pipe-height"]').prop('disabled', false);
      } else {
        $calc.find('[name="gas-pipe-width"]').prop('disabled', true);
        $calc.find('[name="gas-pipe-height"]').prop('disabled', true);
      }
  });

  
  $('.temperature_out').on('change', function () {
    const $calc = $('.calc');
    const $gasMovingHumidity = $calc.find('[name="gas-moving-humidity"]');
    const $gasMovingTemperature = $calc.find('[name="gas-moving-temperature"]');

    if ($(this).val() && $humidityOut.val()) {

      $calc.find('[name="dew-point-temperature"]').val(AeroflexCalc.getGasDewPointTemperature(+$gasMovingTemperature.val() , +$(this).val(), +$gasMovingHumidity.val()))
    } else {
      $calc.find('[name="dew-point-temperature"]').val('');
    }
  });

   $('[name="gas-pipe-width"]').on('change', function () {
    const $calc = $('.calc');
    const $gasPipeHeight = $calc.find('[name="gas-pipe-height"]');

    if($(this).val() && $gasPipeHeight.val()) {
      $calc.find()
    }
   });

   $('[name="gas-pipe-height"]').on('change', function () {
    const $calc = $('.calc');
    const $gasPipeWidth = $calc.find('[name="gas-pipe-width"]');

   });

  $('[name="gas-moving-humidity"]').on('change', function () {
    const $calc = $('.calc');
    const $temperatureOut = $calc.find('.temperature_out');
    const $gasMovingTemperature = $calc.find('[name="gas-moving-temperature"]');

    if ($(this).val() && $temperatureOut.val() && $gasMovingTemperature.val()) {
      $calc.find('[name="dew-point-temperature"]').val(AeroflexCalc.getGasDewPointTemperature(+$gasMovingTemperature.val() , +$temperatureOut.val(), +$(this).val()))
    } else {
      $calc.find('[name="dew-point-temperature"]').val('');
    }
  });

  $(window).on('calc_changes', function () {
      let
          $calc = $('.calc_test'),
          $temperatureOut = $calc.find('.temperature_out');
          

      $calc.find('.calc__result').removeClass('active');
  });

  $('.calc_test ._result').on('click', function () {
      let
          $calc = $(this).closest('.calc_test'),          
          $material = $calc.find('[name="material"] option:selected'),
          $pipe = $calc.find('[name="pipe"] option:selected'),
          $result = $calc.find('.calc__result'),
          $approx = $calc.find('.approx'),


          //газ 
          $gasPipeType = $calc.find('[name="gas-pipe-type"]:checked'), // вид газохода
          $gasPipeWidth = $calc.find('[name="gas-pipe-width"]'), // ширина газохода
          $gasPipeHeight = $calc.find('[name="gas-pipe-height"]'), // высота газохода
          $gasPipeLength = $calc.find('[name="gas-pipe-length"]'), // длина газохода
          $gasPipeOuterDiameter = $calc.find('[name="gas-pipe-outer-diameter"]'), // внешний (приведенный) диаметр газохода
          $gasPipeInnerDiameter = $calc.find('[name="gas-pipe-inner-diameter"]'), // внутренний (приведенный) диаметр газохода
          $gasPipeDepth = $calc.find('[name="gas-pipe-depth"]'), //толщина стенки газохода
          $coolantType = $calc.find('[name="coolant-type"]:checked'), // вид тпелоносителя
          $gasTemperature = $calc.find('[name="gas-temperature"]'), // темература газа(теплоносителя)
          $temperatureOut = $calc.find('.temperature_out'), // температруа окружающего воздуха
          $gasMovingHumidity = $calc.find('[name="gas-moving-humidity"]'), // влажность транспортируемого газа
          $gasMovingTemperature = $calc.find('[name="gas-moving-temperature"]'), // температура транспортируемого газа(теплоносителя)
          $dewPointTemperature = $calc.find('[name="dew-point-temperature"]'), // точка росы
          $gasSpeed = $calc.find('[name="gas-speed"]'), // скорость движения газа
          $gasThermalConductivity = $calc.find('[name="gas-thermal-conductivity"]'), // теплопроводность газа
          $gasKinematicViscosity = $calc.find('[name="gas-kinematic-viscosity"]'), // кинематическая вязкость газа(теплоносителя)
          $gasThermalDiffusivity = $calc.find('[name="gas-thermal-diffusivity"]') // Температуропроводность газа
          $heatTransferCoefficient = $calc.find('[name="heat-transfer-coefficient"]'), // Коэффициент теплоотдачи внутренней поверхности стенки изолируемого объекта
          $heat_coefficient = $calc.find('[name="heat_coefficient"]');

      $approx.closest('.calc__row').addClass('hidden');

      $heat_coefficient.attr('placeholder', '');

    
      // Main
      const
          material = parseInt($material.val(), 10),
          diameterIn = parseFloat($diameter_in.val().replace(/,/, '.')),
          diameterOut = parseFloat($diameter_out.val().replace(/,/, '.')),
          temperatureIn = parseFloat($temperatureIn.val().replace(/,/, '.')),
          temperatureOut = parseFloat($temperatureOut.val().replace(/,/, '.')),
          humidityOut = parseFloat($humidityOut.val().replace(/,/, '.')),
          dewPointTemperature = parseFloat($dewPointTemperature.val().replace(/,/, '.'))
          emission = parseInt($pipe.val(), 10);

      AeroflexCalc.init();
      $heat_coefficient.attr('placeholder', AeroflexCalc.getThermalLossCoefficient(false, false, true, emission));

      // Extended
      const
          heat_coefficient = parseFloat($heat_coefficient.val().replace(/,/, '.'));
          //density = parseFloat($density.val().replace(/,/, '.'));

      AeroflexCalc.init({
          heat_coefficient
      });

      //$density.attr('placeholder', AeroflexCalc.getSurfaceHeatFlowDensity(diameterIn, temperatureIn, isIndoor, hours, isFlat, region).toFixed(4))


      if (!$calc.find('.error').length && typeof AeroflexCalc !== 'undefined') {
        
        let depth = AeroflexCalc.getInsulationWidthForCondensate(material, dewPointTemperature, emission, temperatureIn, temperatureOut, diameterOut);
          $result.addClass('active');
            
          $('.calc__result').addClass('active');
          $('.otvet').val(depth.toFixed(2));
      }
  });
});