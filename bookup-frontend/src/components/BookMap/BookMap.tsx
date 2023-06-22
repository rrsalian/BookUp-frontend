import { MapContainer, TileLayer, Marker, Popup, Polyline, SVGOverlay } from 'react-leaflet'
import { LatLngTuple, DivIcon, latLng } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Buser } from '../../models/User';

export function BookMap(props: { user: Buser, closeMap: () => void }) {

  function getMidpoint(latLon1: LatLngTuple, latLon2: LatLngTuple) : LatLngTuple {
    let srcLatRad = latLon1[0]  * (Math.PI / 180);
    let dstLatRad = latLon2[0]  * (Math.PI / 180);
    let middleLatRad = Math.atan(Math.sinh(Math.log(Math.sqrt(
      (Math.tan(dstLatRad)+1/Math.cos(dstLatRad))*(Math.tan(srcLatRad)+1/Math.cos(srcLatRad))))));
    let middleLat = middleLatRad * (180 / Math.PI)
    let middleLng = (latLon1[1] + latLon2[1]) / 2;
    return [middleLat, middleLng];
  }
  
  function getDistance(latLon1: LatLngTuple, latLon2: LatLngTuple) {
    let ln = latLng(latLon1[0], latLon1[1]);
    return Math.round(ln.distanceTo(latLng(latLon2[0], latLon2[1])) / 1000 * .62 * 100) / 100;
  }
  
  interface BookCoord {
    name: string;
    image?: DivIcon;
    zip: string;
    latLon: LatLngTuple;
  }
  
  let myPosition: BookCoord = {
    name: "Me",
    zip: props.user.zipcode.zip,
    latLon: [props.user.zipcode.lat, props.user.zipcode.lon]
  }
  
  //Array of Other Books
  let booksCoords: BookCoord[] = [
    {
      name: "Steve's Book 2",
      image: new DivIcon({ html: "<img style='width: 90px; margin-left: -30px; margin-top: -30px;' src='https://sothebys-md.brightspotcdn.com/dims4/default/7094078/2147483647/strip/true/crop/2048x2048+0+0/resize/800x800!/quality/90/?url=http%3A%2F%2Fsothebys-brightspot.s3.amazonaws.com%2Fmedia-desk%2F7a%2Fee%2F414b86864262ae5c2fcaaf0cff6b%2Fc78b7front.png' />"}),
      zip: "48207",
      latLon: [42.359600, -83.088847]
    }
  ];
  
  let polyLinePosition = [
    myPosition.latLon,
    booksCoords[0].latLon
  ];
  
  const iconImage: DivIcon = new DivIcon({ html: "<img src='https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png' />" });
  const midPointStyle = "background-color: #ff0000; color: #ffffff; font-weight: bold; border-radius: 5px; width: 100px; height: 20px; margin-left: -50px; margin-top: -10px; border: 1px solid black;"
  
  return (
    <div className='App'>
        <div onClick={props.closeMap} style={{fontSize: "20pt", position: "absolute", right: "25vw", zIndex: "1000", cursor: "pointer"}}>X</div>
        <MapContainer center={myPosition.latLon} zoom={13} scrollWheelZoom={false} style={{width: "50vw", height: "50vh", margin: "10px auto", border: "2px solid #143642"}}>
          <TileLayer url="https://tiles.stadiamaps.com/tiles/osm_bright/{z}/{x}/{y}{r}.png" />
          <Marker position={myPosition.latLon} icon={new DivIcon({html: "<img style='width: 70px; margin-left: -30px; margin-top: -30px;' src='https://www.freeiconspng.com/thumbs/person-icon/person-icon-person-icon-clipart-image-from-our-icon-clipart-category--9.png' />" })}>
            <Popup>
              ME!
            </Popup>
          </Marker>
          {booksCoords.map(b => (
            <Marker position={b.latLon} icon={b.image != null ? b.image : iconImage}>
              <Popup>
                {b.name}
              </Popup>
            </Marker>
          ))}
          <Polyline pathOptions={{ color: 'red' }} positions={polyLinePosition}></Polyline>
          <Marker position={getMidpoint(polyLinePosition[0], polyLinePosition[1])} icon={new DivIcon({ html: "<div style='" + midPointStyle + "'>" + getDistance(polyLinePosition[0], polyLinePosition[1]) + "miles </div>"})}></Marker>
        </MapContainer>
    </div>
  );
}