(function () {
 'use strict';
 function diferencias_divididas(X,Y){
  if(!Array.isArray(X)||!Array.isArray(Y)||X.length!==Y.length||X.length<2||X.length>20)throw Error('Ingresa entre 2 y 20 puntos y vectores del mismo tamaño.');
  if([...X,...Y].some(v=>!Number.isFinite(v)))throw Error('Todos los datos deben ser números finitos.');
  if(new Set(X).size!==X.length)throw Error('Las cargas X deben ser distintas; no se permiten nodos repetidos.');
  const T=Y.map(v=>[v]);
  for(let j=1;j<X.length;j++)for(let i=0;i<X.length-j;i++){
   T[i][j]=(T[i+1][j-1]-T[i][j-1])/(X[i+j]-X[i]);
   if(!Number.isFinite(T[i][j]))throw Error('Los datos producen desbordamiento numérico.');
  }
  return T;
 }
 function evaluar_newton(X,c,x){let v=c[c.length-1];for(let i=c.length-2;i>=0;i--)v=c[i]+(x-X[i])*v;return v;}
 function forma_estandar(X,c){let p=[c[c.length-1]];for(let i=c.length-2;i>=0;i--){const q=Array(p.length+1).fill(0);p.forEach((v,j)=>{q[j]-=X[i]*v;q[j+1]+=v});q[0]+=c[i];p=q;}return p;}
 const api={diferencias_divididas,evaluar_newton,forma_estandar};
 if(typeof module!=='undefined')module.exports=api;
 if(typeof document==='undefined')return;
 Object.assign(window,api);
 const el=id=>document.getElementById(id),f=v=>Number(v.toPrecision(9)).toString();
 const parse=s=>{const parts=s.trim().split(/[\s,;]+/);if(!s.trim())throw Error('Completa ambos vectores.');return parts.map(t=>{const v=Number(t);if(!Number.isFinite(v))throw Error('Usa números separados por comas, espacios o punto y coma.');return v;});};
 function polynomial(p){return p.map((v,i)=>({v,i})).reverse().filter(t=>t.v!==0).map((t,j)=>(t.v<0?' − ':j?' + ':'')+f(Math.abs(t.v))+(t.i?'x'+(t.i>1?'<sup>'+t.i+'</sup>':''):'')).join('')||'0';}
 function draw(X,Y,c,x){
  const lo=Math.min(...X,x),hi=Math.max(...X,x),pad=(hi-lo)*.08||1,a=lo-pad,b=hi+pad;
  const samples=Array.from({length:201},(_,i)=>{const z=a+(b-a)*i/200;return[z,evaluar_newton(X,c,z)]});
  const values=[...Y,...samples.map(t=>t[1])];let vmin=Math.min(...values),vmax=Math.max(...values),yp=(vmax-vmin)*.12||1;vmin-=yp;vmax+=yp;
  const sx=z=>65+(z-a)/(b-a)*680,sy=z=>310-(z-vmin)/(vmax-vmin)*270;
  let grid='';for(let i=0;i<=5;i++){const z=a+(b-a)*i/5,y=vmin+(vmax-vmin)*i/5;grid+=`<path d="M65 ${sy(y)}H745" stroke="#edf0f6"/><text x="57" y="${sy(y)+4}" text-anchor="end">${f(y)}</text><text x="${sx(z)}" y="333" text-anchor="middle">${f(z)}</text>`;}
  const full=diferencias_divididas(X,Y)[0],ghost=samples.map(([z])=>`${sx(z)},${sy(evaluar_newton(X,full,z))}`).join(' ');
  el('newtonChart').innerHTML=`<svg viewBox="0 0 800 370" role="img" aria-label="Curva de latencia con datos experimentales y estimación"><g fill="#74819a" font-size="10">${grid}<text x="405" y="363" text-anchor="middle">Carga x (100 req/s)</text><text x="65" y="20">Latencia (ms)</text></g><polyline points="${ghost}" fill="none" stroke="#adb7cf" stroke-dasharray="5 5"/><polyline points="${samples.map(([z,v])=>`${sx(z)},${sy(v)}`).join(' ')}" fill="none" stroke="#596bd8" stroke-width="3"/>${X.map((z,i)=>`<circle cx="${sx(z)}" cy="${sy(Y[i])}" r="5" fill="#263954"><title>(${z}, ${Y[i]})</title></circle>`).join('')}<circle cx="${sx(x)}" cy="${sy(evaluar_newton(X,c,x))}" r="6" fill="#d97835"/></svg><p class="chart-key">● Datos medidos · <span>━ Grado seleccionado</span> · ┄ Polinomio completo · <b>● Estimación</b></p>`;
 }
 function update(reset=false){try{
  const X=parse(el('newtonX').value),Y=parse(el('newtonY').value),T=diferencias_divididas(X,Y);
  const input=el('newtonAt');if(input.value.trim()===''||!Number.isFinite(Number(input.value)))throw Error('Ingresa una carga válida para evaluar.');const x=Number(input.value);
  const range=el('newtonDegree');range.max=X.length-1;if(reset)range.value=X.length-1;const degree=Math.min(Number(range.value),X.length-1),c=T[0].slice(0,degree+1),value=evaluar_newton(X,c,x),p=forma_estandar(X,c);
  if(!Number.isFinite(value)||p.some(v=>!Number.isFinite(v)))throw Error('Los datos producen desbordamiento numérico.');
  el('degreeLabel').textContent=degree;el('newtonError').innerHTML='';
  el('newtonTable').innerHTML='<div class="newton-scroll"><table class="newton-table"><thead><tr><th>i</th><th>xᵢ</th>'+X.map((_,j)=>'<th>'+(j?'Orden '+j:'f[xᵢ] (ms)')+'</th>').join('')+'</tr></thead><tbody>'+T.map((row,i)=>'<tr><td>'+i+'</td><td>'+f(X[i])+'</td>'+X.map((_,j)=>'<td>'+(row[j]===undefined?'—':f(row[j]))+'</td>').join('')+'</tr>').join('')+'</tbody></table></div>';
  el('newtonResult').innerHTML=`<div class="newton-metrics"><div><small>CARGA EVALUADA</small><strong>${f(x*100)} req/s</strong></div><div><small>P<sub>${degree}</sub>(${f(x)})</small><strong>${f(value)} ms</strong></div></div><h3>Forma de Newton</h3><div class="newton-formula">P<sub>${degree}</sub>(x) = ${c.map((v,j)=>(v<0?' − ':j?' + ':'')+f(Math.abs(v))+X.slice(0,j).map(z=>'(x '+(z<0?'+ '+f(-z):'− '+f(z))+')').join('')).join('')}</div><h3>Forma estándar</h3><div class="newton-formula">P<sub>${degree}</sub>(x) = ${polynomial(p)}</div><p>${x<Math.min(...X)||x>Math.max(...X)?'Extrapolación: la carga está fuera del intervalo medido.':'Interpolación dentro del intervalo medido.'} Grado ${degree}: utiliza los primeros ${degree+1} nodos en el orden ingresado.</p>`;
  el('newtonValidation').innerHTML='<div class="newton-scroll"><table class="newton-table"><thead><tr><th>xᵢ</th><th>Medida (ms)</th><th>P seleccionado</th><th>Error absoluto</th><th>Verificación</th></tr></thead><tbody>'+X.map((z,i)=>{const v=evaluar_newton(X,c,z),err=Math.abs(v-Y[i]),pass=err<=1e-9*Math.max(1,Math.abs(Y[i]));return`<tr><td>${f(z)}</td><td>${f(Y[i])}</td><td>${f(v)}</td><td>${f(err)}</td><td>${pass?'✓ Coincide':'No coincide'}</td></tr>`}).join('')+'</tbody></table></div><p>El polinomio completo interpola todos los nodos (tolerancia relativa 10⁻⁹). Un grado menor puede diferir en los nodos restantes.</p>';
  el('newtonSteps').innerHTML=T.slice(0,-1).map((_,j)=>'<div class="step">Orden '+(j+1)+': '+T.slice(0,X.length-j-1).map((row,i)=>`f[x${i},…,x${i+j+1}] = (${f(T[i+1][j])} − ${f(T[i][j])}) / (${f(X[i+j+1])} − ${f(X[i])}) = ${f(row[j+1])}`).join('<br>')+'</div>').join('');
  draw(X,Y,c,x);
 }catch(e){el('newtonError').innerHTML='';const box=document.createElement('div');box.className='error';box.textContent=e.message;el('newtonError').append(box);['newtonTable','newtonResult','newtonChart','newtonValidation','newtonSteps'].forEach(id=>el(id).innerHTML='');}}
 el('newtonCalculate').onclick=()=>update(true);
 el('newtonExample').onclick=()=>{el('newtonX').value='1, 2, 4, 7';el('newtonY').value='45, 65, 110, 220';el('newtonAt').value=5;update(true);};
 ['newtonX','newtonY'].forEach(id=>el(id).addEventListener('input',()=>update(true)));
 ['newtonAt','newtonDegree'].forEach(id=>el(id).addEventListener('input',()=>update()));
 update(true);
})();
