ScriptAPI.register('100-Unterstützung zählen', true, 'Ademes', 'support-nur-im-forum@ademes.at')
Scriptversion = 'MIT-Lizenz - Copyright (c) 2013 Ademes , Version 1.0'
if (top.frames.length > 1) {
  var doc = (top.frames[1].document.URL.match('game.php') == 'game.php') ? top.frames[1].document : top.frames[0].document
} else {
  var doc = document
};
var page = ''
if (doc.URL.match('mode=units')) {
  page = 'units'
}
if (!doc.URL.match('mode=units') && !doc.URL.match('mode=commands&type=support')) {
  UI.InfoMessage('Du musst dich auf der Verteidigungs-/Unterstützungs-Übersicht oder Befehle-/Unterstützungs Seite befinden!', 3000, true)
} else {
  ADS_Unterstuetzung_zaehlen(doc)
};
function ADS_Unterstuetzung_zaehlen (doc) {
  var output = '<br/>'
  var world = ''
  var troopTable = ''
  if (page == 'units') {
    world = ($('#units_table thead tr th:eq(7) img').attr('src').indexOf('unit_spy') == -1)
    troopTable = $('#units_table tr.row_a, #units_table tr.row_b')
  } else {
    world = ($('#commands_table tr th:eq(6) img').attr('src').indexOf('unit_spy') == -1)
    troopTable = $('#commands_table tr.row_ax, #commands_table tr.row_bx')
  }
  var num_spear = 0
  var num_sword = 1
  var num_archer = (world ? 3 : -999)
  var num_spy = (world ? 4 : 3)
  var num_heavy = (world ? 7 : 5)
  var sum_spear = 0
  var sum_sword = 0
  var sum_archer = 0
  var sum_heavy = 0
  var sum_spy = 0
  var obj = new Object()
  troopTable.each(function (a) {
    acc = ''
    if (page == 'units') {
      $(this).find('a').each(function (b) {
        if ($(this).attr('href').search(/info_player&/) != -1) acc = $(this).html()
      })
    } else {
      acc = $(this).find('td a').eq(0).text().split('Unterstützung für ').pop()
    }

    if (acc != '') {
      var count = obj[acc]
      if (obj[acc] == undefined) {
        count = new Object()
        count.spear = 0
        count.sword = 0
        count.archer = 0
        count.spy = 0
        count.heavy = 0
        obj[acc] = count
      }
      count.spear += parseInt($(this).find('td.unit-item:eq(' + num_spear + ')').html())
      count.sword += parseInt($(this).find('td.unit-item:eq(' + num_sword + ')').html())
      if (world) count.archer += parseInt($(this).find('td.unit-item:eq(' + num_archer + ')').html())
      count.spy += parseInt($(this).find('td.unit-item:eq(' + num_spy + ')').html())
      count.heavy += parseInt($(this).find('td.unit-item:eq(' + num_heavy + ')').html())
      obj[acc] = count
    }
  })
  if (doc.URL.match('away_detail')) {
    output += '<h5>Stammesdeff eingesetzt bei:</h5>'
  } else if (doc.URL.match('support_detail')) {
    output += '<h5>Unterstützungen erhalten von:</h5>'
  } else if (doc.URL.match('mode=commands&type=support')) {
    output += '<h5>Unterstützungen für:</h5>'
  }
  var counter = 0
  var sum = 0
  var color = ''
  troops = (typeof (Truppenanzahl) === 'undefined') ? 20000 : Truppenanzahl

  output += '<th style="padding:4px;">Account</th>'
  output += '<th style="padding:4px;">Speer</th>'
  output += '<th style="padding:4px;">Schwert</th>'
  if (world) output += '<th style="padding:4px;">Bogen</th>'
  output += '<th style="padding:4px;">Skav</th>'
  output += '<th style="padding:4px;">Spy</th>'
  $.each(obj, function (acc, count) {
    counter++

    if (counter % 2) {
      color = '#f0e2be'
    } else {
      color = '#fff5da'
    }

    output += '<tr style="border:solid 1px; background-color: ' + color + '">'
    output += '<td style="padding:2px; border-right: solid 1px;"><span style="color:#603000;font-weight:bold">' + acc + '</span></td>'
    output += '<td style="padding:2px;">' + count.spear + '</td>'
    output += '<td style="padding:2px;">' + count.sword + '</td>'
    if (world) output += '<td style="padding:2px;">' + count.archer + '</td>'
    output += '<td style="padding:2px;">' + count.heavy + '</td>'
    output += '<td style="padding:2px;">' + count.spy + '</td>'

    output += '</tr>'
    sum_spear += Math.round(count.spear / troops * 10) / 10
    sum_sword += Math.round(count.sword / troops * 10) / 10
    sum_archer += Math.round(count.archer / troops * 10) / 10
    sum_heavy += Math.round(count.heavy / troops * 10) / 10
    sum_spy += Math.round(count.spy / troops * 10) / 10
  })

  if (counter == 0) {
    output += '<br><div style="color: green; font-weight: bold;">Keine Stammesdeff!</div><br>'
  } else {
    output += '<br><div style="color: green; font-weight: bold;">Insgesamt: <br/>'
    output += '<span style="margin-left:10px;">Speer: ' + sum_spear + '</span> <br/>'
    output += '<span style="margin-left:10px;">Schwert: ' + sum_sword + '</span> <br/>'
    if (world) output += '<span style="margin-left:10px;">Bogen: ' + sum_archer + '</span> <br/>'
    output += '<span style="margin-left:10px;">Skav: ' + sum_heavy + '</span> <br/>'
    output += '<span style="margin-left:10px;">Spy: ' + sum_spy + '</span></div>'
    output += '<span style="color: grey">(Anzeige pro Seite)</span>'
  } if ($('#ADS_Display').length === 0) {
    $('.maincell').append("<div id='ADS_Display' style='position: fixed; top: 51px; left: 20px; border-radius: 8px; border: 2px #804000 solid; background-color: #F1EBDD'><div id='inline_popup_menu' style='cursor: auto; text-align:center;'>" + game_data.player.name + ' (' + $('#serverDate').text() + ")</div><div style='padding: 15px 10px 5px 10px;'><table id='ADS_Display_Main' style='vertical-align:middle;'></table><br><a onclick='$(\"#ADS_Display\").remove();' style='cursor: pointer;'>Schließen</a></div></div>")
  } else {
    $('#ADS_Display').show()
  }
  $('#ADS_Display_Main').html(output)
};
