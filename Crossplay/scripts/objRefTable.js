const C3 = self.C3;
self.C3_GetObjectRefTable = function () {
	return [
		C3.Plugins.Dictionary,
		C3.Plugins.Function,
		C3.Plugins.Sprite,
		C3.Plugins.Browser,
		C3.Plugins.Spritefont2,
		C3.Plugins.Touch,
		C3.Plugins.TiledBg,
		C3.Plugins.Text,
		C3.Behaviors.Tween,
		C3.Plugins.LocalStorage,
		C3.Plugins.TextBox,
		C3.Plugins.Button,
		C3.Plugins.Keyboard,
		C3.Plugins.Mouse,
		C3.Plugins.Audio,
		C3.Plugins.PlatformInfo,
		C3.Plugins.Eponesh_GameScore,
		C3.Behaviors.Pin,
		C3.Plugins.System.Cnds.LayerVisible,
		C3.Plugins.Spritefont2.Acts.SetText,
		C3.Plugins.System.Cnds.IsGroupActive,
		C3.Plugins.System.Cnds.OnLayoutStart,
		C3.Plugins.Sprite.Acts.Destroy,
		C3.Plugins.TiledBg.Acts.Destroy,
		C3.Plugins.System.Acts.SetVar,
		C3.Plugins.LocalStorage.Acts.GetItem,
		C3.Plugins.System.Cnds.CompareVar,
		C3.Plugins.System.Cnds.TriggerOnce,
		C3.Plugins.Dictionary.Exps.Get,
		C3.Plugins.System.Exps.tokenat,
		C3.Plugins.Function.Acts.CallFunction,
		C3.Plugins.System.Exps.int,
		C3.Plugins.System.Cnds.EveryTick,
		C3.Plugins.Sprite.Acts.ZMoveToObject,
		C3.Plugins.TiledBg.Acts.ZMoveToObject,
		C3.Plugins.System.Cnds.ForEach,
		C3.Plugins.System.Exps.max,
		C3.Plugins.Sprite.Cnds.CompareInstanceVar,
		C3.Plugins.Sprite.Exps.UID,
		C3.Plugins.Sprite.Acts.SetInstanceVar,
		C3.Plugins.Sprite.Exps.PickedCount,
		C3.Plugins.System.Cnds.Else,
		C3.Plugins.Sprite.Acts.SetOpacity,
		C3.Plugins.TiledBg.Acts.SetOpacity,
		C3.Plugins.Sprite.Acts.MoveToBottom,
		C3.Plugins.Touch.Cnds.OnTouchStart,
		C3.Plugins.Touch.Cnds.IsTouchingObject,
		C3.Plugins.Sprite.Exps.X,
		C3.Plugins.Sprite.Exps.Y,
		C3.Plugins.Sprite.Cnds.IsOverlapping,
		C3.Plugins.Sprite.Cnds.PickByUID,
		C3.Plugins.TiledBg.Exps.UID,
		C3.Plugins.Touch.Cnds.IsInTouch,
		C3.Plugins.System.Cnds.Compare,
		C3.Plugins.Sprite.Exps.Width,
		C3.Plugins.Sprite.Cnds.CompareX,
		C3.Plugins.TiledBg.Cnds.CompareInstanceVar,
		C3.Behaviors.Tween.Acts.TweenTwoProperties,
		C3.Plugins.Sprite.Exps.Height,
		C3.Plugins.Sprite.Cnds.CompareY,
		C3.Plugins.Touch.Cnds.OnTouchEnd,
		C3.Plugins.TiledBg.Acts.SetEffectParam,
		C3.Plugins.System.Exps.rgbex,
		C3.Plugins.Sprite.Exps.AnimationFrame,
		C3.Plugins.TiledBg.Acts.SetInstanceVar,
		C3.Plugins.Sprite.Acts.SetSize,
		C3.Plugins.TiledBg.Exps.Height,
		C3.Plugins.Sprite.Acts.SetEffectParam,
		C3.Plugins.Sprite.Acts.SetPos,
		C3.Plugins.TiledBg.Exps.X,
		C3.Plugins.TiledBg.Exps.Y,
		C3.Plugins.TiledBg.Exps.Width,
		C3.Plugins.System.Acts.Wait,
		C3.Plugins.System.Acts.SetLayerVisible,
		C3.Plugins.Sprite.Acts.MoveToTop,
		C3.Plugins.System.Cnds.PickNth,
		C3.Plugins.Sprite.Exps.Count,
		C3.Plugins.System.Acts.CreateObject,
		C3.Behaviors.Tween.Acts.TweenOneProperty,
		C3.Plugins.Sprite.Acts.SetVisible,
		C3.Plugins.TiledBg.Cnds.CompareWidth,
		C3.Plugins.TiledBg.Acts.SetWidth,
		C3.Behaviors.Tween.Cnds.OnTweensFinished,
		C3.Plugins.Sprite.Acts.AddInstanceVar,
		C3.Plugins.Sprite.Cnds.CompareOpacity,
		C3.Plugins.Function.Cnds.OnFunction,
		C3.Plugins.Function.Exps.Param,
		C3.Plugins.Sprite.Exps.LayerName,
		C3.Plugins.Spritefont2.Acts.SetScale,
		C3.Plugins.Audio.Cnds.IsTagPlaying,
		C3.Plugins.Audio.Acts.Play,
		C3.Plugins.Audio.Acts.Stop,
		C3.Plugins.LocalStorage.Acts.CheckItemExists,
		C3.Plugins.LocalStorage.Cnds.OnItemExists,
		C3.Plugins.LocalStorage.Cnds.OnItemGet,
		C3.Plugins.LocalStorage.Exps.ItemValue,
		C3.Plugins.Dictionary.Acts.AddKey,
		C3.Plugins.System.Cnds.For,
		C3.Plugins.System.Exps.loopindex,
		C3.Plugins.System.Acts.AddVar,
		C3.Plugins.Sprite.Cnds.PickInstVarHiLow,
		C3.Behaviors.Pin.Acts.Pin,
		C3.Plugins.System.Exps.layoutwidth,
		C3.Plugins.System.Exps.layoutheight,
		C3.Plugins.System.Exps.tokencount,
		C3.Plugins.Sprite.Acts.SetAnimFrame,
		C3.Plugins.TiledBg.Acts.SetAngle,
		C3.Plugins.TiledBg.Acts.SetSize,
		C3.Plugins.System.Acts.ResetGlobals,
		C3.Plugins.System.Acts.RestartLayout,
		C3.Plugins.System.Exps.find,
		C3.Plugins.LocalStorage.Acts.SetItem,
		C3.Plugins.Audio.Acts.PlayByName,
		C3.Plugins.System.Acts.SetLayerOpacity,
		C3.Plugins.Sprite.Exps.Opacity,
		C3.Plugins.Button.Acts.SetPos,
		C3.Plugins.Sprite.Cnds.CompareFrame,
		C3.Plugins.System.Acts.GoToLayout,
		C3.Plugins.Touch.Cnds.OnTapGestureObject,
		C3.Plugins.Button.Cnds.OnClicked,
		C3.Plugins.Eponesh_GameScore.Acts.AdsShowFullscreen,
		C3.Plugins.Touch.Cnds.OnTouchObject,
		C3.Plugins.Eponesh_GameScore.Acts.AdsShowRewarded,
		C3.Plugins.Button.Acts.SetCSSStyle,
		C3.Plugins.Spritefont2.Acts.SetPosToObject,
		C3.Plugins.Touch.Exps.AbsoluteY,
		C3.Plugins.System.Exps.scrolly,
		C3.Plugins.Touch.Exps.SpeedAt,
		C3.Plugins.System.Acts.Scroll,
		C3.Plugins.System.Exps.min,
		C3.Plugins.TextBox.Acts.SetCSSStyle,
		C3.Plugins.TextBox.Exps.Text,
		C3.Plugins.Keyboard.Cnds.OnKeyReleased,
		C3.Plugins.Sprite.Acts.SetPosToObject,
		C3.Plugins.Mouse.Cnds.OnRelease,
		C3.Plugins.Mouse.Cnds.IsOverObject,
		C3.Plugins.TextBox.Acts.SetText,
		C3.Plugins.System.Exps.viewportright,
		C3.Plugins.System.Exps.viewportleft,
		C3.Plugins.System.Exps.viewportbottom,
		C3.Plugins.System.Exps.viewporttop,
		C3.Plugins.Sprite.Cnds.IsOnLayer
	];
};
self.C3_JsPropNameTable = [
	{levelsData: 0},
	{Function: 0},
	{posX: 0},
	{posY: 0},
	{order: 0},
	{guest: 0},
	{type: 0},
	{lineFromLineSource: 0},
	{xx: 0},
	{yy: 0},
	{Spot: 0},
	{MAINcenterHolder: 0},
	{capacity: 0},
	{sideInTouch: 0},
	{a: 0},
	{usedCapacity: 0},
	{completed: 0},
	{inTouch: 0},
	{MAINlineSource: 0},
	{Browser: 0},
	{MAINlineSourceCapacity: 0},
	{Touch: 0},
	{MAINlineHead: 0},
	{lineSource: 0},
	{side: 0},
	{UniqueID: 0},
	{hasHead: 0},
	{red: 0},
	{green: 0},
	{blue: 0},
	{MAINline: 0},
	{Text: 0},
	{colorsData: 0},
	{MAINblock: 0},
	{w: 0},
	{h: 0},
	{BtnPlay: 0},
	{BtnInfo: 0},
	{Title: 0},
	{Tween: 0},
	{BlackC: 0},
	{BtnSound: 0},
	{Sprite3: 0},
	{n: 0},
	{BtnLevel: 0},
	{txtBtnLevel: 0},
	{BtnBack: 0},
	{BtnDoonDookStudio: 0},
	{LocalStorage: 0},
	{txtLevel: 0},
	{MAINlineSourceBack: 0},
	{LCcenterHolder: 0},
	{LCtextBox: 0},
	{LCline: 0},
	{LCstring: 0},
	{LCregister: 0},
	{LCplace: 0},
	{LCselectedLineSource: 0},
	{LCButton: 0},
	{LClineSource: 0},
	{LCblock: 0},
	{Keyboard: 0},
	{Mouse: 0},
	{UIpause: 0},
	{PAUSEbackground: 0},
	{PAUSEhome: 0},
	{PAUSEreset: 0},
	{PAUSEmusic: 0},
	{PAUSEsound: 0},
	{PAUSEback: 0},
	{prevLevel: 0},
	{nextLevel: 0},
	{LEVELDONEback: 0},
	{LEVELDONEhome: 0},
	{LEVELDONEretry: 0},
	{LEVELDONEnext: 0},
	{BtnMusic: 0},
	{Audio: 0},
	{Hand: 0},
	{PlatformInfo: 0},
	{TiledBackground: 0},
	{GamePush: 0},
	{LEVELDONEhome2: 0},
	{rate: 0},
	{share: 0},
	{бан: 0},
	{старт: 0},
	{вид: 0},
	{image20240910T: 0},
	{image20240910T2: 0},
	{Pin: 0},
	{FSpot: 0},
	{lineSourcesFamily: 0},
	{linesFamily: 0},
	{FButtons: 0},
	{lineHeadsFamily: 0},
	{LCplacesFamily: 0},
	{levelData: 0},
	{Запуск: 0},
	{баннер: 0},
	{lineSourcesData: 0},
	{blocksData: 0},
	{level: 0},
	{lastTrueTouchedPlaceX: 0},
	{lastTrueTouchedPlaceY: 0},
	{leftPlace: 0},
	{rightPlace: 0},
	{topPlace: 0},
	{bottomPlace: 0},
	{timeToPlay: 0},
	{touchedLineSource: 0},
	{touchedLine: 0},
	{Tutorials: 0},
	{TutStep: 0},
	{Interstitial_ID: 0},
	{InterstitialVideo_ID: 0},
	{ShowVideoAd: 0},
	{levelsDataSet: 0},
	{placeOrder: 0},
	{rowCount: 0},
	{placeSize: 0},
	{lineSourceData: 0},
	{blockPlace: 0},
	{Info: 0},
	{Sound: 0},
	{Music: 0},
	{CamOn: 0},
	{Dragging: 0},
	{DragScrollY: 0},
	{DragTouchY: 0},
	{DragTouchSpd: 0},
	{DragTouchDir: 0},
	{best_levels: 0},
	{MaxTop: 0},
	{MinBottom: 0},
	{levels: 0},
	{PassedLevels: 0},
	{v: 0},
	{placeOrder2: 0},
	{colCount: 0},
	{lineSourcesData2: 0},
	{blocksData2: 0},
	{string: 0},
	{activeLineSource: 0},
	{leftPlace2: 0},
	{rightPlace2: 0},
	{topPlace2: 0},
	{bottomPlace2: 0}
];

self.InstanceType = {
	levelsData: class extends self.IDictionaryInstance {},
	Function: class extends self.IInstance {},
	Spot: class extends self.ISpriteInstance {},
	MAINcenterHolder: class extends self.ISpriteInstance {},
	MAINlineSource: class extends self.ISpriteInstance {},
	Browser: class extends self.IInstance {},
	MAINlineSourceCapacity: class extends self.ISpriteFontInstance {},
	Touch: class extends self.IInstance {},
	MAINlineHead: class extends self.ISpriteInstance {},
	MAINline: class extends self.ITiledBackgroundInstance {},
	Text: class extends self.ITextInstance {},
	colorsData: class extends self.IDictionaryInstance {},
	MAINblock: class extends self.ISpriteInstance {},
	BtnPlay: class extends self.ISpriteInstance {},
	BtnInfo: class extends self.ISpriteInstance {},
	Title: class extends self.ISpriteInstance {},
	BlackC: class extends self.ISpriteInstance {},
	BtnSound: class extends self.ISpriteInstance {},
	Sprite3: class extends self.ISpriteInstance {},
	BtnLevel: class extends self.ISpriteInstance {},
	txtBtnLevel: class extends self.ISpriteFontInstance {},
	BtnBack: class extends self.ISpriteInstance {},
	BtnDoonDookStudio: class extends self.ISpriteInstance {},
	LocalStorage: class extends self.IInstance {},
	txtLevel: class extends self.ISpriteFontInstance {},
	MAINlineSourceBack: class extends self.ISpriteInstance {},
	LCcenterHolder: class extends self.ISpriteInstance {},
	LCtextBox: class extends self.ITextInputInstance {},
	LCline: class extends self.ISpriteInstance {},
	LCstring: class extends self.ITextInputInstance {},
	LCregister: class extends self.IButtonInstance {},
	LCplace: class extends self.ISpriteInstance {},
	LCselectedLineSource: class extends self.ISpriteInstance {},
	LCButton: class extends self.IButtonInstance {},
	LClineSource: class extends self.ISpriteInstance {},
	LCblock: class extends self.ISpriteInstance {},
	Keyboard: class extends self.IInstance {},
	Mouse: class extends self.IInstance {},
	UIpause: class extends self.ISpriteInstance {},
	PAUSEbackground: class extends self.ISpriteInstance {},
	PAUSEhome: class extends self.ISpriteInstance {},
	PAUSEreset: class extends self.ISpriteInstance {},
	PAUSEmusic: class extends self.ISpriteInstance {},
	PAUSEsound: class extends self.ISpriteInstance {},
	PAUSEback: class extends self.ISpriteInstance {},
	prevLevel: class extends self.ISpriteInstance {},
	nextLevel: class extends self.ISpriteInstance {},
	LEVELDONEback: class extends self.ISpriteInstance {},
	LEVELDONEhome: class extends self.ISpriteInstance {},
	LEVELDONEretry: class extends self.ISpriteInstance {},
	LEVELDONEnext: class extends self.ISpriteInstance {},
	BtnMusic: class extends self.ISpriteInstance {},
	Audio: class extends self.IInstance {},
	Hand: class extends self.ISpriteInstance {},
	PlatformInfo: class extends self.IInstance {},
	TiledBackground: class extends self.ITiledBackgroundInstance {},
	GamePush: class extends self.IInstance {},
	LEVELDONEhome2: class extends self.ISpriteInstance {},
	rate: class extends self.ISpriteInstance {},
	share: class extends self.ISpriteInstance {},
	бан: class extends self.IButtonInstance {},
	старт: class extends self.IButtonInstance {},
	вид: class extends self.IButtonInstance {},
	image20240910T: class extends self.ISpriteInstance {},
	image20240910T2: class extends self.ISpriteInstance {},
	FSpot: class extends self.ISpriteInstance {},
	lineSourcesFamily: class extends self.ISpriteInstance {},
	linesFamily: class extends self.ITiledBackgroundInstance {},
	FButtons: class extends self.ISpriteInstance {},
	lineHeadsFamily: class extends self.ISpriteInstance {},
	LCplacesFamily: class extends self.ISpriteInstance {}
}