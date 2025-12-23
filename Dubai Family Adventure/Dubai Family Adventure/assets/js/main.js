(()=>{
 const p=location.pathname.split("/").pop()||"index.html";
 document.querySelectorAll(".menu a").forEach(a=>{
  if(a.getAttribute("href")===p) a.classList.add("active");
 });
})();
(()=>{
 const nav=document.querySelector(".topbar .menu");
 if(!nav) return;
 const topbar=document.querySelector(".topbar .nav");
 if(!topbar) return;
 const burgerMenu=document.createElement("div");
 burgerMenu.className="burger-menu";
 burgerMenu.innerHTML='<span></span><span></span><span></span>';
 topbar.appendChild(burgerMenu);
 const mobileMenu=document.createElement("div");
 mobileMenu.className="mobile-menu";
 const navClone=nav.cloneNode(true);
 navClone.style.display='block';
 navClone.style.visibility='visible';
 const navList=navClone.querySelector('.nav-list');
 if(navList){
  navList.style.display='flex';
  navList.style.visibility='visible';
  navList.style.flexDirection='column';
  navList.querySelectorAll('a').forEach(link=>{
   link.style.display='block';
   link.style.visibility='visible';
   link.style.opacity='1';
   link.style.color='var(--text-light)';
  });
  navList.querySelectorAll('li').forEach(li=>{
   li.style.display='block';
   li.style.visibility='visible';
  });
 }else{
  navClone.style.display='flex';
  navClone.style.visibility='visible';
  navClone.style.flexDirection='column';
  navClone.querySelectorAll('a').forEach(link=>{
   link.style.display='block';
   link.style.visibility='visible';
   link.style.opacity='1';
   link.style.color='var(--text-light)';
  });
 }
 mobileMenu.appendChild(navClone);
 document.body.appendChild(mobileMenu);
 const toggleMenu=()=>{
  mobileMenu.classList.toggle('active');
  burgerMenu.classList.toggle('active');
  if(mobileMenu.classList.contains('active')){
   document.body.style.overflow='hidden';
   mobileMenu.style.display='block';
   mobileMenu.style.visibility='visible';
  }else{
   document.body.style.overflow='';
  }
 };
 burgerMenu.addEventListener('click',toggleMenu);
 mobileMenu.querySelectorAll('a').forEach(link=>{
  link.addEventListener('click',()=>{
   mobileMenu.classList.remove('active');
   burgerMenu.classList.remove('active');
   document.body.style.overflow='';
  });
 });
 mobileMenu.addEventListener('click',e=>{
  if(e.target===mobileMenu){
   mobileMenu.classList.remove('active');
   burgerMenu.classList.remove('active');
   document.body.style.overflow='';
  }
 });
 document.addEventListener('keydown',e=>{
  if(e.key==='Escape'&&mobileMenu.classList.contains('active')){
   mobileMenu.classList.remove('active');
   burgerMenu.classList.remove('active');
   document.body.style.overflow='';
  }
 });
})();
document.querySelectorAll("[data-tabs]").forEach(root=>{
 const tabs=root.querySelectorAll(".tab");
 const panels=root.querySelectorAll(".panel");
 tabs.forEach((t,i)=>{
  t.onclick=()=>{
   tabs.forEach(x=>x.classList.remove("active"));
   panels.forEach(p=>p.style.display="none");
   t.classList.add("active");
   panels[i].style.display="block";
  };
 });
 tabs[0]?.click();
});
window.openModal=id=>document.getElementById(id).classList.add("open");
window.closeModal=id=>document.getElementById(id).classList.remove("open");
document.querySelectorAll(".modal").forEach(modal=>{
 modal.onclick=e=>{
  if(e.target===modal){
   modal.classList.remove("open");
  }
 };
});
(()=>{
 const form=document.getElementById("plannerForm");
 if(!form) return;
 const result=document.getElementById("plannerResult");
 const routes={
  nature:["Dubai Safari Park","Al Qudra Lakes","Dubai Desert Conservation Reserve"],
  water:["Aquaventure Waterpark","Wild Wadi Waterpark","Laguna Waterpark"],
  indoor:["IMG Worlds of Adventure","KidZania Dubai","OliOli Museum"]
 };
 const preferenceRoutes={
  "Interactive & Educational":["OliOli Museum","KidZania Dubai","Aquaventure Splashers"],
  "Adventure & Thrills":["IMG Worlds of Adventure","Motiongate Dubai","Thrill Rides at Theme Parks"],
  "Relaxation & Nature":["Legoland Dubai","Water Park Adventures","Desert Safari & Adventure"]
 };
 form.onsubmit=e=>{
  e.preventDefault();
  const preference=form.preference?.value||form.querySelector('select[name="preference"]')?.value;
  const type=form.type?.value||form.querySelector('select[name="type"]')?.value;
  const days=form.days?.value||form.querySelector('select[name="days"]')?.value;
  let picks=[];
  if(preference&&preferenceRoutes[preference]){
   picks=preferenceRoutes[preference];
  }else if(type&&routes[type]){
   picks=routes[type];
  }
  localStorage.setItem("familyPlan",JSON.stringify({preference,type,days}));
  result.innerHTML=`
   <div class="card" style="margin-top:20px">
    <h3>Your ${days}-day Family Route</h3>
    <p style="color:var(--accent);margin:10px 0"><strong>Preference:</strong> ${preference||"Not specified"}</p>
    <p style="margin-bottom:15px">Recommended attractions for your family:</p>
    <ul class="feature-list">${picks.map(p=>`<li>${p}</li>`).join("")}</ul>
    <button class="btn" onclick="openModal('tickets')" style="margin-top:20px">Book Tickets</button>
   </div>
  `;
  result.scrollIntoView({behavior:"smooth",block:"start"});
 };
})();
document.querySelectorAll(".accordion-header").forEach(header=>{
 header.onclick=()=>{
  const item=header.parentElement;
  const isActive=item.classList.contains("active");
  document.querySelectorAll(".accordion-item").forEach(i=>i.classList.remove("active"));
  if(!isActive) item.classList.add("active");
 };
});
window.handleTicketSubmit=function(e){
 e.preventDefault();
 const form=e.target;
 const formData=new FormData(form);
 const data=Object.fromEntries(formData);
 console.log("Ticket request submitted:",data);
 localStorage.setItem("ticketRequest",JSON.stringify(data));
 closeModal('tickets');
 window.location.href="thank-you.html";
};
window.handleContactSubmit=function(e){
 e.preventDefault();
 const form=e.target;
 const formData=new FormData(form);
 const data=Object.fromEntries(formData);
 console.log("Contact message submitted:",data);
 localStorage.setItem("contactMessage",JSON.stringify(data));
 window.location.href="thank-you.html";
};

