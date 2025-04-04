// Замените {APP_ID} на ваш реальный идентификатор приложения
var script = document.createElement('script');
script.src = "https://static.sonartech.io/lib/1.0.0/sonar.js?appId=app_454e73a0&isDebug=false"; 
document.head.appendChild(script);

// Инициализация SDK, когда скрипт загружен
script.onload = function() {
    sonar.init({
        appId: 'app_454e73a0', // Замените YOUR_APP_ID на ваш реальный ID
        isDebug: false
    });

    // Здесь вы можете добавить код для управления рекламой
};

const scriptsInEvents = {

	async EventMenu_Event1_Act15(runtime, localVars)
	{
		window.Sonar.show({ adUnit: "banner" });
	},

	async EventMenu_Event2_Act1(runtime, localVars)
	{
		window.Sonar.show({ adUnit: "interstitial" });
	},

	async EventMenu_Event3_Act1(runtime, localVars)
	{
		window.Sonar.show({ adUnit: "reward" });
	},

	async EventGame_Event52_Act2(runtime, localVars)
	{

	}
};

self.C3.ScriptsInEvents = scriptsInEvents;
