const orte = [
    { 'lat': -103.8, 'lon': 40.6, 'name': 'USA' },
    { 'lat': 134, 'lon': -24, 'name': 'Australien' },
    { 'lat': -1, 'lon': 8, 'name': 'Togo' },
    { 'lat': 77.6, 'lon': 22.1, 'name': 'Indien' },
    { 'lat': -106.7, 'lon': 58.5, 'name': 'Kanada' },
    { 'lat': 16.8, 'lon': -23.2, 'name': 'Deutsch Südwestafrika (Heute Namibia)' },
    { 'lat': 127.8, 'lon': 36.5, 'name': 'Südkorea' },
    { 'lat': 34, 'lon': -7, 'name': 'Deutsch Ostafrika (Tansania)' },
    { 'lat': 12, 'lon': 5, 'name': 'Kamerun' },
    { 'lat': -172, 'lon': -14, 'name': 'Deutsch Samoa' },
    { 'lat': 147.83, 'lon': -8.23, 'name': 'Deutsch Neuguinea' },
    { 'lat': 120.245, 'lon': 36.123, 'name': 'Kiautschou' },
]

const text = {
    'USA': '<p>Der Teil von Nordamerika, der heute als USA bekannt ist, war eine der frühen Britischen (Siedlungs-)Kolonien.</p><p>Weil der Seeweg sehr lange gedauert hat, waren die USA auch als Kolonie schon relativ unabhängig, sie wollten aber richtig unabhängig sein und es gab den Unabhängigkeitskrieg, den die USA mit Hilfe von Frankreich gewannen und so eine der ersten Kolonien waren, die unabhängig wurde.</p><p>Die Ureinwohner wurden aber von den Siedler stark bekämpft und es wurden sehr viele getötet. Außerdem wurden viele afrikanische Sklaven in die USA geliefert um dort auf Plantagen zu arbeiten.</p>',
    'Australien': '<p>Australien war eine Britische Strafkolonie, in die viele brittische Häftlinge gebracht wurden.</p>',
    'Togo': '<p>War eine Deutsche Kolonie, die sehr stark ausgebeutet wurde und die einzige Deutsche Kolonie war die mehr eingenommen hat, als sir Kosten verursacht hat.</p>',
    'Indien': '<p>Indien war sowohl eine Britische als auch Niederländische Kolonie. Und ein sehr bekanntest Beispiel für Kolonialismus.</p><p>Die Briten hatten eine sehr durchdachtes System, bei dem nur sehr wenige und oft zahlenmäßig unterlegene Britische Soldaten, die häufig gewechselt wurden, mit extremer härte alle Aufstände niederschlugen, auch um abzuschrecken. Außerdem bauten die Briten in Inden Opium an, das sie dann nach China verkauften, was zu den Opium-Kriegen führte.</p>',
    'Kanada': '<p>Kanada war Britische und Französische (Siedlungs-)Kolonie, weil beide Länder verfeindet waren gab es immer wieder Kämpfe um Kanada.</p><p>Kanadaa ist auch einer der Staaten, die immer noch die Britische Queen als Königinn haben.</p>',
    'Deutsch Südwestafrika (Heute Namibia)': 'War eine ursprünglich als Siedlungskolonie, aber nie so umgesetzte Deutsche Kolonie.',
    'Südkorea': 'Südkorea war einen Japanische (War die einzige Kolonialmacht außerhalb Europas) Kolonie, hat sich aber zu einem der technologisch am weitesten Land etwickelt was besonders ist, weil viele andere ehemalige Kolonien auch heute noch wirtschaftliche Probleme haben.',
    'Deutsch Ostafrika (Tansania)': 'Deutsch Ostafrika war eine Deutsche Beherrschungskolonie.',
    'Kamerun': 'Kamerun war eine Deutsche Beherrschungskolonie.',
    'Deutsch Samoa': 'Deutsch Samoa war eine Deutsche Beherrschungskolonie.',
    'Deutsch Neuguinea': 'Deutsch Neuguinea war eine Deutsche Beherrschungskolonie.',
    'Kiautschou': 'Kiautschou war eine Deutsche Kolonie, die dem Deutschen Reich den Zugang zu China ermöglichen sollte. Außerdem war es nicht dem Reichskolonialamt unterstellt sondern der Marine.'
}


function openMyPopup(name) {

    var header = document.getElementById('title-info');
    var desc = document.getElementById('desc');
    console.log(name);

    if (!document.getElementById('map-info').classList.contains('active')) {
        document.getElementById('map-info').classList.add('active');
    }
    header.innerHTML = name;
    desc.innerHTML = text[name];

}



function jumpTo(lon, lat, zoom) {
    var x = Lon2Merc(lon);
    var y = Lat2Merc(lat);
    map.setCenter(new OpenLayers.LonLat(x, y), zoom);
    return false;
}

function Lon2Merc(lon) {
    return 20037508.34 * lon / 180;
}

function Lat2Merc(lat) {
    var PI = 3.14159265358979323846;
    lat = Math.log(Math.tan((90 + lat) * PI / 360)) / (PI / 180);
    return 20037508.34 * lat / 180;
}

function addMarker(layer, lon, lat, popupContent) {

    var ll = new OpenLayers.LonLat(Lon2Merc(lon), Lat2Merc(lat));
    var feature = new OpenLayers.Feature(layer, ll);

    var marker = new OpenLayers.Marker(ll);

    var markerClick = function (evt) {
        console.log(evt);
        openMyPopup(popupContent);

        OpenLayers.Event.stop(evt);
    };
    marker.events.register("mousedown", feature, markerClick);

    layer.addMarker(marker);
}


var map;
var layer_mapnik;
var layer_tah;
var layer_markers;

function drawmap() {
    OpenLayers.Lang.setCode('de');

    // Position und Zoomstufe der Karte
    var lon = 6.641389;
    var lat = 49.756667;
    var zoom = 1;

    map = new OpenLayers.Map('map', {
        projection: new OpenLayers.Projection("EPSG:900913"),
        displayProjection: new OpenLayers.Projection("EPSG:4326"),
        controls: [
            new OpenLayers.Control.Navigation(),
            new OpenLayers.Control.PanZoomBar()],
        maxExtent:
            new OpenLayers.Bounds(-20037508.34, -20037508.34,
                20037508.34, 20037508.34),
        numZoomLevels: 18,
        maxResolution: 156543,
        units: 'meters'
    });

    layer_mapnik = new OpenLayers.Layer.OSM.Mapnik("Mapnik");
    layer_markers = new OpenLayers.Layer.Markers("Address", {
        projection: new OpenLayers.Projection("EPSG:4326"),
        visibility: true, displayInLayerSwitcher: false
    });

    map.addLayers([layer_mapnik, layer_markers]);
    jumpTo(lon, lat, zoom);

    // Marker einfügen
    for (let i = 0; i < orte.length; i++) {
        addMarker(layer_markers, orte[i].lat, orte[i].lon, orte[i].name);
        console.log(i);

    }

}