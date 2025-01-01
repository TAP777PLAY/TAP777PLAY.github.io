const C3 = self.C3;
self.C3_GetObjectRefTable = function () {
	return [
		C3.Plugins.Audio,
		C3.Plugins.LocalStorage,
		C3.Plugins.Arr,
		C3.Plugins.Touch,
		C3.Plugins.Browser,
		C3.Plugins.Keyboard,
		C3.Plugins.AJAX,
		C3.Plugins.Sprite,
		C3.Behaviors.Anchor,
		C3.Behaviors.Tween,
		C3.Behaviors.Fade,
		C3.Plugins.TiledBg,
		C3.Behaviors.Sin,
		C3.Plugins.Text,
		C3.Behaviors.Rotate,
		C3.Behaviors.scrollto,
		C3.Plugins.Spritefont2,
		C3.Plugins.Eponesh_GameScore,
		C3.Plugins.System.Cnds.OnLayoutStart,
		C3.Behaviors.Sin.Acts.SetEnabled,
		C3.Plugins.System.Acts.SetVar,
		C3.Plugins.Sprite.Acts.Destroy,
		C3.Plugins.System.Acts.SetGroupActive,
		C3.Plugins.Eponesh_GameScore.Acts.AdsShowSticky,
		C3.Plugins.LocalStorage.Acts.CheckItemExists,
		C3.Plugins.System.Cnds.CompareVar,
		C3.Plugins.Sprite.Acts.SetAnimFrame,
		C3.Plugins.System.Acts.Wait,
		C3.Plugins.System.Acts.CreateObject,
		C3.Plugins.Spritefont2.Cnds.CompareInstanceVar,
		C3.Plugins.Spritefont2.Acts.SetText,
		C3.Plugins.LocalStorage.Cnds.OnItemExists,
		C3.Plugins.LocalStorage.Exps.ItemValue,
		C3.Plugins.LocalStorage.Cnds.OnItemMissing,
		C3.Plugins.Audio.Acts.Stop,
		C3.Behaviors.Tween.Cnds.OnTweensFinished,
		C3.Plugins.Eponesh_GameScore.Acts.AdsShowRewarded,
		C3.Plugins.Sprite.Acts.SetPos,
		C3.Plugins.Touch.Cnds.OnTouchObject,
		C3.Plugins.Touch.Cnds.OnTapGestureObject,
		C3.Plugins.Touch.Exps.X,
		C3.Plugins.Touch.Exps.Y,
		C3.Plugins.System.Acts.WaitForPreviousActions,
		C3.Plugins.System.Cnds.TriggerOnce,
		C3.Plugins.Audio.Acts.Play,
		C3.Plugins.Eponesh_GameScore.Cnds.OnAdsRewardedReward,
		C3.Plugins.Spritefont2.Acts.SetInstanceVar,
		C3.Plugins.System.Acts.AddVar,
		C3.Plugins.LocalStorage.Acts.SetItem,
		C3.Plugins.Sprite.Cnds.OnCollision,
		C3.Plugins.System.Acts.SubVar,
		C3.Plugins.Sprite.Cnds.CompareFrame,
		C3.Plugins.Browser.Acts.RequestFullScreen,
		C3.Plugins.Browser.Acts.CancelFullScreen,
		C3.Plugins.AJAX.Acts.Request,
		C3.Plugins.AJAX.Cnds.OnComplete,
		C3.Plugins.Arr.Acts.JSONLoad,
		C3.Plugins.AJAX.Exps.LastData,
		C3.Plugins.Arr.Cnds.CompareX,
		C3.Plugins.Arr.Exps.At,
		C3.Plugins.System.Cnds.Else,
		C3.Plugins.Browser.Acts.Alert,
		C3.Plugins.Arr.Cnds.ArrForEach,
		C3.Plugins.Arr.Acts.SetXYZ,
		C3.Plugins.Arr.Exps.CurX,
		C3.Plugins.Arr.Exps.CurY,
		C3.Plugins.Sprite.Acts.SetVisible,
		C3.Plugins.System.Cnds.ForEach,
		C3.Plugins.System.Cnds.For,
		C3.Plugins.Arr.Cnds.CompareXYZ,
		C3.Plugins.System.Exps.loopindex,
		C3.Plugins.System.Exps.random,
		C3.Plugins.Sprite.Exps.AnimationFrame,
		C3.Plugins.Sprite.Exps.UID,
		C3.Plugins.Sprite.Acts.SetInstanceVar,
		C3.Behaviors.Tween.Acts.TweenTwoProperties,
		C3.Plugins.Sprite.Acts.SetScale,
		C3.Plugins.Sprite.Acts.MoveToBottom,
		C3.Plugins.System.Acts.SetFunctionReturnValue,
		C3.Plugins.Sprite.Acts.SetBoolInstanceVar,
		C3.Plugins.System.Cnds.Compare,
		C3.Plugins.Sprite.Cnds.PickByUID,
		C3.Plugins.Sprite.Cnds.CompareInstanceVar,
		C3.Plugins.Sprite.Exps.Y,
		C3.Plugins.Sprite.Cnds.OnDestroyed,
		C3.Plugins.Sprite.Exps.X,
		C3.Plugins.Sprite.Cnds.IsBoolInstanceVarSet,
		C3.Plugins.Sprite.Acts.SetY,
		C3.Plugins.System.Exps.dt,
		C3.Plugins.Sprite.Cnds.CompareY,
		C3.Plugins.Touch.Cnds.IsTouchingObject,
		C3.Plugins.Arr.Acts.SetXY,
		C3.Plugins.System.Cnds.CompareBetween,
		C3.Plugins.Touch.Cnds.OnTouchEnd,
		C3.Plugins.Sprite.Cnds.CompareX,
		C3.Plugins.Arr.Acts.Clear,
		C3.Plugins.System.Acts.RestartLayout,
		C3.Plugins.System.Acts.StopLoop,
		C3.Plugins.Sprite.Cnds.IsAnimPlaying,
		C3.Plugins.Sprite.Acts.Spawn,
		C3.Plugins.System.Acts.GoToLayout,
		C3.Plugins.TiledBg.Acts.SetSize,
		C3.Plugins.TiledBg.Acts.SetPos,
		C3.Plugins.TiledBg.Acts.MoveToTop,
		C3.Behaviors.Tween.Acts.TweenOneProperty,
		C3.Plugins.Eponesh_GameScore.Acts.AdsShowFullscreen,
		C3.Plugins.Sprite.Cnds.IsOverlappingOffset,
		C3.Plugins.Sprite.Acts.SetAngle,
		C3.Plugins.Sprite.Exps.Angle,
		C3.Plugins.Sprite.Acts.SetX,
		C3.Plugins.TiledBg.Acts.SetWidth,
		C3.Plugins.TiledBg.Exps.Width,
		C3.Plugins.TiledBg.Cnds.CompareWidth,
		C3.Plugins.System.Cnds.IsGroupActive,
		C3.Plugins.System.Cnds.Every,
		C3.Plugins.System.Exps.layoutwidth,
		C3.Plugins.System.Exps.layoutheight,
		C3.Plugins.Sprite.Acts.SetSize,
		C3.Plugins.Eponesh_GameScore.Acts.PlayerSet,
		C3.Plugins.Eponesh_GameScore.Acts.PlayerSync,
		C3.Plugins.Eponesh_GameScore.Acts.AdsRefreshSticky,
		C3.Plugins.Eponesh_GameScore.Acts.GameStart,
		C3.Plugins.Browser.Acts.GoToURLWindow,
		C3.Plugins.Eponesh_GameScore.Acts.SocialsShare,
		C3.Plugins.Eponesh_GameScore.Acts.LeaderboardOpen,
		C3.Plugins.Eponesh_GameScore.Acts.PlayerSetScore,
		C3.Plugins.System.Cnds.OnLoadFinished,
		C3.Plugins.System.Exps.loadingprogress,
		C3.Plugins.Audio.Cnds.IsTagPlaying,
		C3.Plugins.Audio.Acts.PlayByName,
		C3.Plugins.System.Acts.SetLayerVisible,
		C3.Plugins.System.Acts.SetLayerInteractive,
		C3.Plugins.Eponesh_GameScore.Acts.PlayerLoad,
		C3.Plugins.Eponesh_GameScore.Exps.PlayerGet,
		C3.Plugins.Spritefont2.Acts.Destroy,
		C3.Plugins.Sprite.Exps.Count,
		C3.Plugins.Sprite.Acts.MoveToTop,
		C3.Plugins.Keyboard.Cnds.IsKeyDown,
		C3.Plugins.Spritefont2.Acts.MoveToBottom,
		C3.Plugins.Spritefont2.Acts.SetY,
		C3.Plugins.Spritefont2.Exps.Y,
		C3.Plugins.Spritefont2.Acts.SetX,
		C3.Plugins.Spritefont2.Exps.X,
		C3.Behaviors.Tween.Cnds.IsAnyPlaying,
		C3.Plugins.Touch.Cnds.OnTouchStart,
		C3.Plugins.Spritefont2.Acts.SetVisible,
		C3.Plugins.Sprite.Cnds.IsVisible
	];
};
self.C3_JsPropNameTable = [
	{Audio: 0},
	{LocalStorage: 0},
	{GameData: 0},
	{SwapData: 0},
	{Touch: 0},
	{ArrayTemp2: 0},
	{array_level: 0},
	{Browser: 0},
	{Keyboard: 0},
	{AJAX: 0},
	{array_save: 0},
	{array_map_temp: 0},
	{btn_menu: 0},
	{Anchor: 0},
	{btn_pause: 0},
	{btn_endless: 0},
	{btn_restart: 0},
	{btn_resume: 0},
	{btn_sound: 0},
	{btn_close: 0},
	{btn_level: 0},
	{btn_back: 0},
	{btn_continue: 0},
	{level: 0},
	{btn_lvl: 0},
	{btn_sounds: 0},
	{row: 0},
	{col: 0},
	{Moving: 0},
	{TargetY: 0},
	{RedFoc: 0},
	{Swap: 0},
	{isMatch: 0},
	{Trigger: 0},
	{Tween: 0},
	{diamond: 0},
	{Tile: 0},
	{bg_game: 0},
	{Fade: 0},
	{effect: 0},
	{window: 0},
	{bg_menu: 0},
	{darkBG: 0},
	{Sine: 0},
	{game_title: 0},
	{header: 0},
	{Outline: 0},
	{timer_progress: 0},
	{combos: 0},
	{footer: 0},
	{type: 0},
	{Text: 0},
	{progressPlace: 0},
	{progress_bar: 0},
	{Rotate: 0},
	{loading: 0},
	{bg_map: 0},
	{ScrollTo: 0},
	{scroll: 0},
	{SpriteFont: 0},
	{hand: 0},
	{big_score_bar: 0},
	{movesCpunterlace: 0},
	{diamond_ui: 0},
	{check: 0},
	{diamond_tween: 0},
	{big_bar2: 0},
	{bar_start: 0},
	{btn_start: 0},
	{diamond_start: 0},
	{BabkiFont: 0},
	{GamePush: 0},
	{Ы: 0},
	{gold: 0},
	{END: 0},
	{ENDS: 0},
	{TIMEOUT: 0},
	{INFO: 0},
	{Синусоида: 0},
	{Textspitefont: 0},
	{PAUSA: 0},
	{balans: 0},
	{CRASH: 0},
	{NEXT: 0},
	{"1HOD": 0},
	{RR: 0},
	{logogame: 0},
	{ASD: 0},
	{ASD2: 0},
	{button_fullscreensheet: 0},
	{boom: 0},
	{vibr: 0},
	{Ресурс: 0},
	{BOOB: 0},
	{Спрайт: 0},
	{linia: 0},
	{Textspitefont2: 0},
	{textBoom: 0},
	{Buttons: 0},
	{bestscore: 0},
	{score: 0},
	{game_mode: 0},
	{max_color: 0},
	{state: 0},
	{width: 0},
	{height: 0},
	{PosX: 0},
	{PosY: 0},
	{tile_size: 0},
	{fall_speed: 0},
	{is_falling: 0},
	{draging: 0},
	{top_cell: 0},
	{match_count: 0},
	{cur_level: 0},
	{cur_moves: 0},
	{moves: 0},
	{babki: 0},
	{liniaBoom: 0},
	{bomba: 0},
	{vibrboomba: 0},
	{rew: 0},
	{Переменная1: 0},
	{value1: 0},
	{value2: 0},
	{redfoc: 0},
	{frame: 0},
	{uid: 0},
	{shift: 0},
	{shift2: 0},
	{cur: 0},
	{Touching: 0},
	{NotMatch: 0},
	{value: 0},
	{plus: 0},
	{substract: 0},
	{ScoreTemp: 0},
	{ScoreTemp2: 0},
	{origin_x: 0},
	{origin_y: 0},
	{end_x: 0},
	{end_y: 0},
	{music: 0},
	{sound: 0},
	{VIBORMUZ: 0},
	{sounds: 0},
	{loaded: 0},
	{key_storage: 0},
	{name: 0},
	{total_level: 0},
	{unlocked_level: 0},
	{st: 0},
	{et: 0},
	{cur_page: 0},
	{end_y_of_level: 0},
	{bg_map_size: 0},
	{lvl_btns_per_screen: 0},
	{scroll_min_y: 0},
	{scroll_max_y: 0},
	{index: 0},
	{initial_bg_map_y: 0},
	{map_multiplier: 0},
	{pos_y: 0},
	{pos_x: 0},
	{step_move: 0},
	{direction: 0},
	{Target1: 0},
	{Target2: 0},
	{Target3: 0},
	{x: 0},
	{y: 0}
];

self.InstanceType = {
	Audio: class extends self.IInstance {},
	LocalStorage: class extends self.IInstance {},
	GameData: class extends self.IArrayInstance {},
	SwapData: class extends self.IArrayInstance {},
	Touch: class extends self.IInstance {},
	ArrayTemp2: class extends self.IArrayInstance {},
	array_level: class extends self.IArrayInstance {},
	Browser: class extends self.IInstance {},
	Keyboard: class extends self.IInstance {},
	AJAX: class extends self.IInstance {},
	array_save: class extends self.IArrayInstance {},
	array_map_temp: class extends self.IArrayInstance {},
	btn_menu: class extends self.ISpriteInstance {},
	btn_pause: class extends self.ISpriteInstance {},
	btn_endless: class extends self.ISpriteInstance {},
	btn_restart: class extends self.ISpriteInstance {},
	btn_resume: class extends self.ISpriteInstance {},
	btn_sound: class extends self.ISpriteInstance {},
	btn_close: class extends self.ISpriteInstance {},
	btn_level: class extends self.ISpriteInstance {},
	btn_back: class extends self.ISpriteInstance {},
	btn_continue: class extends self.ISpriteInstance {},
	btn_lvl: class extends self.ISpriteInstance {},
	btn_sounds: class extends self.ISpriteInstance {},
	diamond: class extends self.ISpriteInstance {},
	Tile: class extends self.ISpriteInstance {},
	bg_game: class extends self.ISpriteInstance {},
	effect: class extends self.ISpriteInstance {},
	window: class extends self.ISpriteInstance {},
	bg_menu: class extends self.ISpriteInstance {},
	darkBG: class extends self.ITiledBackgroundInstance {},
	game_title: class extends self.ISpriteInstance {},
	header: class extends self.ISpriteInstance {},
	Outline: class extends self.ISpriteInstance {},
	timer_progress: class extends self.ITiledBackgroundInstance {},
	combos: class extends self.ISpriteInstance {},
	footer: class extends self.ISpriteInstance {},
	Text: class extends self.ITextInstance {},
	progressPlace: class extends self.ISpriteInstance {},
	progress_bar: class extends self.ISpriteInstance {},
	loading: class extends self.ISpriteInstance {},
	bg_map: class extends self.ISpriteInstance {},
	scroll: class extends self.ISpriteInstance {},
	SpriteFont: class extends self.ISpriteFontInstance {},
	hand: class extends self.ISpriteInstance {},
	big_score_bar: class extends self.ISpriteInstance {},
	movesCpunterlace: class extends self.ISpriteInstance {},
	diamond_ui: class extends self.ISpriteInstance {},
	check: class extends self.ISpriteInstance {},
	diamond_tween: class extends self.ISpriteInstance {},
	big_bar2: class extends self.ISpriteInstance {},
	bar_start: class extends self.ISpriteInstance {},
	btn_start: class extends self.ISpriteInstance {},
	diamond_start: class extends self.ISpriteInstance {},
	BabkiFont: class extends self.ISpriteFontInstance {},
	GamePush: class extends self.IInstance {},
	Ы: class extends self.ISpriteInstance {},
	gold: class extends self.ISpriteInstance {},
	Textspitefont: class extends self.ISpriteFontInstance {},
	PAUSA: class extends self.ISpriteInstance {},
	balans: class extends self.ISpriteInstance {},
	CRASH: class extends self.ISpriteInstance {},
	NEXT: class extends self.ISpriteInstance {},
	_1HOD: class extends self.ISpriteInstance {},
	RR: class extends self.ISpriteInstance {},
	logogame: class extends self.ISpriteInstance {},
	ASD: class extends self.ISpriteInstance {},
	ASD2: class extends self.ISpriteInstance {},
	button_fullscreensheet: class extends self.ISpriteInstance {},
	boom: class extends self.ISpriteInstance {},
	vibr: class extends self.ISpriteInstance {},
	Ресурс: class extends self.ISpriteInstance {},
	BOOB: class extends self.ISpriteInstance {},
	Спрайт: class extends self.ISpriteInstance {},
	linia: class extends self.ISpriteInstance {},
	Textspitefont2: class extends self.ISpriteFontInstance {},
	textBoom: class extends self.ISpriteInstance {},
	Buttons: class extends self.ISpriteInstance {}
}