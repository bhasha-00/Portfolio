// Runs before first paint: play the intro only on a first visit this session, never with reduced motion.
try{var d=document.documentElement;d.dataset.intro=(sessionStorage.getItem('seen')||matchMedia('(prefers-reduced-motion: reduce)').matches)?'done':'play'}catch(e){}
