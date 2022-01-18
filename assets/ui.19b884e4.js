import{t as m,L as u,S as n}from"./index.84caf6b2.js";import{h as d}from"./vendor.57a43f51.js";const p=d.exports.compile(m);class v{constructor(){this.map=new u("map-container"),this.container=document.getElementById("note-container"),this.active=null,this.cluster=L.markerClusterGroup({maxClusterRadius:40,showCoverageOnHover:!1}),this.map.addLayer(this.cluster),this.markers=[],this.halo=L.circleMarker([0,0]),this.map.addLayer(this.halo),this.features=L.geoJSON(),this.map.addLayer(this.features),this.map.onClick(()=>this.clear())}add(e,t){let a=e.color;t.data.status===n.ALL&&(a=e.status===n.OPEN?"green":"red");const r=L.marker(e.coordinates,{icon:new L.divIcon({html:`<svg class="marker ${a}"><use xlink:href="#marker-template"></use></svg>`,iconSize:[25,40],iconAnchor:[25/2,40],popupAnchor:[0,-30],className:"marker-icon"})});r.on("click",()=>{if(this.active===e)return;this.clear(),this.active=e,this.container.innerHTML=p(e,{allowedProtoProperties:{actions:!0,badges:!0}}),setTimeout(()=>{this.container.classList.remove("out-of-view")},100),this.halo=L.circleMarker(e.coordinates,{color:window.getComputedStyle(document.documentElement).getPropertyValue(`--${a}-primary`),weight:1}),this.map.addLayer(this.halo);const{linked:o}=e;if(o){const i=`
          [out:json];
          ${o.type}(id:${o.id});
          convert Feature ::=::,::id=id(),::geom=geom();
          out geom tags;`;fetch("https://overpass-api.de/api/interpreter",{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:new URLSearchParams({data:i})}).then(s=>{if(s.ok)return s.json();throw new Error(`Error while fetching Overpass API: ${s.status} ${s.statusText}`)}).then(s=>{if(!("elements"in s)||s.elements.length===0)return;const[l]=s.elements;l.geometry.type!=="Point"&&this.features.addData(l)})}}),this.markers.push(r)}clear(){this.active=null,this.halo.remove(),this.features.clearLayers(),this.container.classList.add("out-of-view")}apply(e){this.map.resize(),this.clear(),this.cluster.clearLayers(),this.cluster.addLayers(this.markers),!e&&this.markers.length>0&&this.map.flyToBounds(this.cluster.getBounds(),1),this.markers=[]}}var g=`<div class="card" data-note-id="{{id}}">
  <div class="card-header note-badges">
    <div class="columns col-gapless">
      <div class="column">
        {{{badges.user}}}
        {{{badges.age}}}
        {{{badges.comments}}}
        {{{badges.country}}}
      </div>
      <div class="column col-auto">
        {{{badges.report}}}
      </div>
    </div>
  </div>

  <div class="card-body text-break">
    {{{comments.0.html}}}
  </div>

  <div class="card-footer note-actions">
    {{> actions actions}}
  </div>
</div>
`;const f=d.exports.compile(g);class w{constructor(){this.fragment=new DocumentFragment}add(e){const t=document.createElement("div");t.classList.add("column","col-3","col-xl-4","col-md-6","col-sm-12","p-1"),t.innerHTML=f(e,{allowedProtoProperties:{actions:!0,badges:!0}}),this.fragment.appendChild(t)}apply(){const e=document.getElementById("list");for(;e.lastChild;)e.removeChild(e.lastChild);e.appendChild(this.fragment)}}const h={map:new v,list:new w};class b{constructor(e){this.notes=[],this.query=null,this.view=e}set view(e){const t=Object.keys(h);if(!t.includes(e))throw new TypeError(`Argument must be one of ${t.join(", ")}`);this._view={name:e,handler:h[e]},this.reload()}get view(){return this._view.name}show(e,t,a){this.query=t,this.notes=e;const r=e.length,o=e.reduce((i,s)=>i+s.created.getTime(),0)/r;return e.forEach(i=>{this.isNoteVisible(i,t)&&this._view.handler.add(i,t)}),this._view.handler.apply(a),Promise.resolve({amount:r,average:new Date(o)})}isNoteVisible(e,t){return(t.data.status===n.OPEN?e.status===n.OPEN:!0)&&(t.data.status===n.CLOSED?e.status===n.CLOSED:!0)}get(e){return this.notes.find(t=>t.id===e)}update(e,t){const a=this.notes.findIndex(r=>r.id===e);if(a===-1)throw new Error(`The note with the id ${e} could not be found in the array`);return this.notes[a]=t,this.reload()}reload(){return this.show(this.notes,this.query,!0)}}export{b as default};
//# sourceMappingURL=ui.19b884e4.js.map
