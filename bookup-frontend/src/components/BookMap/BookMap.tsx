import { MapContainer, TileLayer, Marker, Popup, Polyline, SVGOverlay } from 'react-leaflet'
import { LatLngTuple, DivIcon, latLng } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Buser } from '../../models/User';
import { useEffect } from 'react';

export function BookMap(props: { user: Buser, closeMap: (isbn: string) => void, isbnUsers: Buser[] }) {

  function getMidpoint(latLon1: LatLngTuple, latLon2: LatLngTuple) : LatLngTuple {
    if(latLon2 == null) {
      return [latLon1[0], latLon1[1]];
    }
    let srcLatRad = latLon1[0]  * (Math.PI / 180);
    let dstLatRad = latLon2[0]  * (Math.PI / 180);
    let middleLatRad = Math.atan(Math.sinh(Math.log(Math.sqrt(
      (Math.tan(dstLatRad)+1/Math.cos(dstLatRad))*(Math.tan(srcLatRad)+1/Math.cos(srcLatRad))))));
    let middleLat = middleLatRad * (180 / Math.PI)
    let middleLng = (latLon1[1] + latLon2[1]) / 2;
    return [middleLat, middleLng];
  }
  
  function getDistance(latLon1: LatLngTuple, latLon2: LatLngTuple) {
    if(latLon2 == null) {
      return 0;
    }
    let ln = latLng(latLon1[0], latLon1[1]);
    return Math.round(ln.distanceTo(latLng(latLon2[0], latLon2[1])) / 1000 * .62 * 100) / 100;
  }

  //Array of Other Books
  let booksCoords: BookCoord[] = [];

  props.isbnUsers.forEach(u => {
    booksCoords.push({
      name: u.email,
      image: new DivIcon({html: "<div>IMAGE GO HERE</div>"}),
      zip: u.zipcode.zip,
      latLon: [u.zipcode.lat, u.zipcode.lon]
    });
  });
  
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
  
  let polyLinePosition = [
    myPosition.latLon
  ];

  booksCoords.forEach(b => {
    polyLinePosition.push(b.latLon);
  });
  
  const iconImage: DivIcon = new DivIcon({ html: "<img src='https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png' />" });
  const midPointStyle = "background-color: #ff0000; color: #ffffff; font-weight: bold; border-radius: 5px; width: 100px; height: 20px; margin-left: -50px; margin-top: -10px; border: 1px solid black;"
  
  return (
    <div className='App'>
        <div onClick={() => props.closeMap("")} style={{fontSize: "20pt", position: "absolute", right: "25vw", zIndex: "1000", cursor: "pointer"}}>X</div>
        <MapContainer center={myPosition.latLon} zoom={13} scrollWheelZoom={false} style={{width: "50vw", height: "50vh", margin: "10px auto", border: "2px solid #143642"}}>
          <TileLayer url="https://tile.openstreetmap.org/{z}/{x}/{y}.png" />
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