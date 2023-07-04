import { MapContainer, TileLayer, Marker, Popup, Polyline, SVGOverlay } from 'react-leaflet'
import { LatLngTuple, DivIcon, latLng } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Buser } from '../../models/User';
import { useEffect, useState } from 'react';
import "./BookMap.css"
import { Link } from 'react-router-dom';
import { ViewChat } from "../ViewChat/ViewChat"
import ReactDOM from 'react-dom';

export function BookMap(props: { user: Buser, closeMap: (isbn: string) => void, isbnUsers: Buser[], chatUser: (chatUser: Buser) => void, chatUserIsbn: string }) {

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
  let booksCoords: BookCoord[] = [];
  let coordUsers: Buser[] = [];

  props.isbnUsers.forEach(u => {
    booksCoords.push({
      name: u.email,
      image: new DivIcon({ html: `<img class=map-user-profile-picture src=${u.img} alt=user profile picture></img>` }),
      zip: u.zipcode.zip,
      latLon: [u.zipcode.lat, u.zipcode.lon]
    });

    coordUsers.push(u);
  });

  const firstBookCoord = booksCoords.length > 0 ? booksCoords[0] : myPosition;

  const [polyLinePosition, setPolylinePosition] = useState<LatLngTuple[]>([myPosition.latLon, firstBookCoord.latLon]);
  const [mapReady, setMapReady] = useState(true);

  function getMidpoint(latLon1: LatLngTuple, latLon2: LatLngTuple): LatLngTuple {
    if (latLon2 == null) {
      return [latLon1[0], latLon1[1]];
    }
    let srcLatRad = latLon1[0] * (Math.PI / 180);
    let dstLatRad = latLon2[0] * (Math.PI / 180);
    let middleLatRad = Math.atan(Math.sinh(Math.log(Math.sqrt(
      (Math.tan(dstLatRad) + 1 / Math.cos(dstLatRad)) * (Math.tan(srcLatRad) + 1 / Math.cos(srcLatRad))))));
    let middleLat = middleLatRad * (180 / Math.PI)
    let middleLng = (latLon1[1] + latLon2[1]) / 2;
    return [middleLat, middleLng];
  }

  function getDistance(latLon1: LatLngTuple, latLon2: LatLngTuple) {
    if (latLon2 == null) {
      return 0;
    }
    console.log("latLon1" + latLon1);

    let ln = latLng(latLon1[0], latLon1[1]);
    //let ln = latLng(42.758215, -83.743683);
    return Math.round(ln.distanceTo(latLng(latLon2[0], latLon2[1])) / 1000 * .62 * 100) / 100;
  }

  function getZoom(latLon1: LatLngTuple, latLon2: LatLngTuple) {
     let dist = getDistance(latLon1, latLon2);
     return Math.log2(40000 / dist);
  }

  function setCurrentBookCoord(coord: BookCoord) {
    setPolylinePosition([myPosition.latLon, coord.latLon]);
    setMapReady(false);
    setTimeout(() => {
      setMapReady(true);
    }, 10);
  }

  function setOtherUser(bUser: Buser) {
    console.log(bUser);
    props.chatUser(bUser);    
  }

  console.log("booksCoords " + JSON.stringify(booksCoords));

  const iconImage: DivIcon = new DivIcon({ html: "<img src='https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png' />" });
  const midPointStyle = "background-color: #ff0000; color: #ffffff; font-weight: bold; border-radius: 5px; width: 100px; height: 20px; margin-left: -50px; margin-top: -10px; border: 1px solid black;"

  return (
    <div className='App'>
      <div onClick={() => props.closeMap("")} style={{ fontSize: "20pt", position: "absolute", right: "21vw", zIndex: "2000", cursor: "pointer" }}>✗</div>
      {mapReady ?
      <MapContainer center={getMidpoint(polyLinePosition[0], polyLinePosition[1])} zoom={getZoom(polyLinePosition[0], polyLinePosition[1])} scrollWheelZoom={false} style={{ width: "60vw", height: "50vh", marginTop: "-60px", marginLeft: "auto", marginRight: "auto", border: "2px solid #143642" }}>
        <TileLayer url="https://tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Marker position={myPosition.latLon} icon={new DivIcon({ html: "<img style='width: 70px; margin-left: -30px; margin-top: -30px;' src='https://www.freeiconspng.com/thumbs/person-icon/person-icon-person-icon-clipart-image-from-our-icon-clipart-category--9.png' />" })}>
          <Popup>
            ME!
          </Popup>
        </Marker>
        {booksCoords.map((b, index) => (
          <Marker position={b.latLon} icon={b.image != null ? b.image : iconImage} eventHandlers={{ click: () => setCurrentBookCoord(b) }}>
            <Popup>
              {b.name}
              <button onClick={() => {setOtherUser(coordUsers[index])}} className="chat"><Link to="/chat">Wanna chat</Link></button>
            </Popup>
          </Marker>
        ))}
        <Polyline pathOptions={{ color: 'red' }} positions={polyLinePosition}></Polyline>
        <Marker position={getMidpoint(polyLinePosition[0], polyLinePosition[1])} icon={new DivIcon({ html: "<div style='" + midPointStyle + "'>" + getDistance(polyLinePosition[0], polyLinePosition[1]) + "miles </div>" })}></Marker>
      </MapContainer> : <div></div>
      }
    </div>
  );
}