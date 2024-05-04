


const scriptsInEvents = {

	async GameEvents_Event2_Act1(runtime, localVars)
	{
		localVars.vs = new Date (runtime.GameScore.serverTime).toLocaleString('RU', {
		 weekday: 'long'
		  
		   
		});
	},

	async GameEvents_Event2_Act2(runtime, localVars)
	{
		localVars.variantName1 = new Date (runtime.GameScore.serverTime).toLocaleString('RU', {
		 day: '2-digit',
		  month: '2-digit',
		  weekday: 'long'
		  
		   
		});
	},

	async GameEvents_Event2_Act3(runtime, localVars)
	{
		localVars.month1 = new Date (runtime.GameScore.serverTime).toLocaleString('RU', {
		  month: '2-digit',
		  year: 'numeric',
		   
		   
		});
	},

	async GameEvents_Event2_Act4(runtime, localVars)
	{
		let date = new Date();
		date.setDate(date.getDate() - 1);
		localVars.lastDate1 = date.toLocaleString('ru', {
		 day: '2-digit',
		  month: '2-digit',
		  weekday: 'long'
		});
	},

	async MenuEvents_Event1_Act1(runtime, localVars)
	{
		document.querySelector('body').style['backgroundColor'] = '#9bb598'
	}

};

self.C3.ScriptsInEvents = scriptsInEvents;

