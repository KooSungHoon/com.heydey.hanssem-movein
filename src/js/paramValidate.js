//-------------------------------------------------------
// Validate 스크립트
// 앞에  ParamValidate 를 붙여준다.
//-------------------------------------------------------

var ParamValidate = {};

//공백 체크
//ParamValidate.isEmpty(str)  => return true| false
ParamValidate.isEmpty = function(str) {
	return !(/\S/).test(str);
};

//숫자 체크
//ParamValidate.isNum(str)  => return true|false
ParamValidate.isNum = function(str) {
	return (/^[0-9]+$/).test(str);
};

//영문 체크
//ParamValidate.isAlpha()  => return true|false
ParamValidate.isAlpha = function(str){
	return (/^[a-zA-Z]+$/).test(str);	
};

//영문 숫자 체크
//ParamValidate.isAlphaNumber(str)  => return true|false
ParamValidate.isAlphaNumber = function(str){
	return (/^[0-9a-zA-Z]+$/).test(str);	
};

//한글 체크
//ParamValidate.isHangul(str)  => return true|false	
ParamValidate.isHangul = function(str){
	return (/^[ㄱ-힣]+$/).test(str);	
};

//이메일 체크
//ParamValidate.isEmail(str)  => return true|false	
ParamValidate.isEmail = function(str){
	return (/^[a-zA-Z0-9\-\.\_\!\+\']+@[a-zA-Z0-9\-\.]+\.([a-zA-Z]{1,5})$/).test(str);
};

//8~15자리, 영문자, 숫자, 특수문자 포함인지 체크
//ParamValidate.checkPassword(str)  => return true|false	
/*ParamValidate.isPassword = function(str) {
	return (/^.*(?=^.{8,15}$)(?=.*\d)(?=.*[a-zA-Z])(?=.*[!@#$%^&+=]).*$/).test(str);
};*/




//8~15자리인지 체크
//ParamValidate.isNumPassword(str)  => return true|false	
ParamValidate.isNumPassword = function(str) {
	return (/^.*(?=^.{8,15}$).*$/).test(str);
};

//영문자, 숫자, 특수문자 포함인지 체크
//ParamValidate.checkPassword(str)  => return true|false	
ParamValidate.isPassword = function(str) {
	return (/^.*(?=.*\d)(?=.*[a-zA-Z]).*$/).test(str);
};

//연속된 문자 3개 이상 있는지 체크
//ParamValidate.isContinousStr(str)  => return true|false
ParamValidate.isContinousStr = function(str) {
	return (/(\w)\1\1/).test(str);
};

//공백이 있는지 체크
//ParamValidate.isBlank(str)  => return true|false
ParamValidate.isBlank = function(str) {
	return (/\s/g).test(str);
};

//휴대폰번호 체크
//ParamValidate.isMobileNo(str)  => return true|false
ParamValidate.isMobileNo = function(str) {
	return (/^01([016789])([1-9]{1})([0-9]{2,3})([0-9]{4})$/).test(str);
};

//일반전화번호 체크
//ParamValidate.isPhoneNo(str)  => return true|false
ParamValidate.isPhoneNo = function(str) {
	return (/^(0(2|3[1-3]|4[1-4]|5[1-5]|6[1-4]|7[0-0]))(\d{3,4})(\d{4})$/).test(str);
};

//전화번호 형식 체크
//ParamValidate.isPhoneNoForm(str)  => return true|false
ParamValidate.isPhoneNoForm = function(str) {
	return (/^\d{2,4}-\d{3,4}-\d{4}$/).test(str);
};

// 첫글자 영문인지 체크
ParamValidate.isAlphabet = function(str) {
	return (/^[A-Za-z]+$/).test(str.substring(0,1));
}

ParamValidate.isName = function(str) {
	var useTextEn = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQUSTUVWXYZ0123456789';
	var useTextKr = '가각간갇갈갉갊감갑값갓갔강갖갗같갚갛개객갠갤갬갭갯갰갱갸갹갼걀걋걍걔걘걜거걱건걷걸걺검겁것겄 \
					겅겆겉겊겋게겐겔겜겝겟겠겡겨격겪견겯결겸겹겻겼경곁계곈곌곕곗고곡곤곧골곪곬곯곰곱곳공곶과곽관괄괆괌괍괏광괘괜\
					괠괩괬괭괴괵괸괼굄굅굇굉교굔굘굡굣구국군굳굴굵굶굻굼굽굿궁궂궈궉권궐궜궝궤궷귀귁귄귈귐귑귓규균귤그극근귿글긁\
					금급긋긍긔기긱긴긷길긺김깁깃깅깆깊까깍깎깐깔깖깜깝깟깠깡깥깨깩깬깰깸깹깻깼깽꺄꺅꺌꺼꺽꺾껀껄껌껍껏껐껑께껙껜\
					껨껫껭껴껸껼꼇꼈꼍꼐꼬꼭꼰꼲꼴꼼꼽꼿꽁꽂꽃꽈꽉꽐꽜꽝꽤꽥꽹꾀꾄꾈꾐꾑꾕꾜꾸꾹꾼꿀꿇꿈꿉꿋꿍꿎꿔꿜꿨꿩꿰꿱꿴꿸\
					뀀뀁뀄뀌뀐뀔뀜뀝뀨끄끅끈끊끌끎끓끔끕끗끙끝끼끽낀낄낌낍낏낑나낙낚난낟날낡낢남납낫났낭낮낯낱낳내낵낸낼냄냅냇냈\
					냉냐냑냔냘냠냥너넉넋넌널넒넓넘넙넛넜넝넣네넥넨넬넴넵넷넸넹녀녁년녈념녑녔녕녘녜녠노녹논놀놂놈놉놋농높놓놔놘놜\
					놨뇌뇐뇔뇜뇝뇟뇨뇩뇬뇰뇹뇻뇽누눅눈눋눌눔눕눗눙눠눴눼뉘뉜뉠뉨뉩뉴뉵뉼늄늅늉느늑는늘늙늚늠늡늣능늦늪늬늰늴니닉\
					닌닐닒님닙닛닝닢다닥닦단닫달닭닮닯닳담답닷닸당닺닻닿대댁댄댈댐댑댓댔댕댜더덕덖던덛덜덞덟덤덥덧덩덫덮데덱덴델\
					뎀뎁뎃뎄뎅뎌뎐뎔뎠뎡뎨뎬도독돈돋돌돎돐돔돕돗동돛돝돠돤돨돼됐되된될됨됩됫됴두둑둔둘둠둡둣둥둬뒀뒈뒝뒤뒨뒬뒵뒷\
					뒹듀듄듈듐듕드득든듣들듦듬듭듯등듸디딕딘딛딜딤딥딧딨딩딪따딱딴딸땀땁땃땄땅땋때땍땐땔땜땝땟땠땡떠떡떤떨떪떫떰\
					떱떳떴떵떻떼떽뗀뗄뗌뗍뗏뗐뗑뗘뗬또똑똔똘똥똬똴뙈뙤뙨뚜뚝뚠뚤뚫뚬뚱뛔뛰뛴뛸뜀뜁뜅뜨뜩뜬뜯뜰뜸뜹뜻띄띈띌띔띕띠\
					띤띨띰띱띳띵라락란랄람랍랏랐랑랒랖랗래랙랜랠램랩랫랬랭랴략랸럇량러럭런럴럼럽럿렀렁렇레렉렌렐렘렙렛렝려력련렬\
					렴렵렷렸령례롄롑롓로록론롤롬롭롯롱롸롼뢍뢨뢰뢴뢸룀룁룃룅료룐룔룝룟룡루룩룬룰룸룹룻룽뤄뤘뤠뤼뤽륀륄륌륏륑류륙\
					륜률륨륩륫륭르륵른를름릅릇릉릊릍릎리릭린릴림립릿링마막만많맏말맑맒맘맙맛망맞맡맣매맥맨맬맴맵맷맸맹맺먀먁먈먕\
					머먹먼멀멂멈멉멋멍멎멓메멕멘멜멤멥멧멨멩며멱면멸몃몄명몇몌모목몫몬몰몲몸몹못몽뫄뫈뫘뫙뫼묀묄묍묏묑묘묜묠묩묫\
					무묵묶문묻물묽묾뭄뭅뭇뭉뭍뭏뭐뭔뭘뭡뭣뭬뮈뮌뮐뮤뮨뮬뮴뮷므믄믈믐믓미믹민믿밀밂밈밉밋밌밍및밑바박밖밗반받발밝\
					밞밟밤밥밧방밭배백밴밸뱀뱁뱃뱄뱅뱉뱌뱍뱐뱝버벅번벋벌벎범법벗벙벚베벡벤벧벨벰벱벳벴벵벼벽변별볍볏볐병볕볘볜보\
					복볶본볼봄봅봇봉봐봔봤봬뵀뵈뵉뵌뵐뵘뵙뵤뵨부북분붇불붉붊붐붑붓붕붙붚붜붤붰붸뷔뷕뷘뷜뷩뷰뷴뷸븀븃븅브븍븐블븜\
					븝븟비빅빈빌빎빔빕빗빙빚빛빠빡빤빨빪빰빱빳빴빵빻빼빽뺀뺄뺌뺍뺏뺐뺑뺘뺙뺨뻐뻑뻔뻗뻘뻠뻣뻤뻥뻬뼁뼈뼉뼘뼙뼛뼜뼝\
					뽀뽁뽄뽈뽐뽑뽕뾔뾰뿅뿌뿍뿐뿔뿜뿟뿡쀼쁑쁘쁜쁠쁨쁩삐삑삔삘삠삡삣삥사삭삯산삳살삵삶삼삽삿샀상샅새색샌샐샘샙샛샜\
					생샤샥샨샬샴샵샷샹섀섄섈섐섕서석섞섟선섣설섦섧섬섭섯섰성섶세섹센셀셈셉셋셌셍셔셕션셜셤셥셧셨셩셰셴셸솅소속솎\
					손솔솖솜솝솟송솥솨솩솬솰솽쇄쇈쇌쇔쇗쇘쇠쇤쇨쇰쇱쇳쇼쇽숀숄숌숍숏숑수숙순숟술숨숩숫숭숯숱숲숴쉈쉐쉑쉔쉘쉠쉥쉬\
					쉭쉰쉴쉼쉽쉿슁슈슉슐슘슛슝스슥슨슬슭슴습슷승시식신싣실싫심십싯싱싶싸싹싻싼쌀쌈쌉쌌쌍쌓쌔쌕쌘쌜쌤쌥쌨쌩썅써썩\
					썬썰썲썸썹썼썽쎄쎈쎌쏀쏘쏙쏜쏟쏠쏢쏨쏩쏭쏴쏵쏸쐈쐐쐤쐬쐰쐴쐼쐽쑈쑤쑥쑨쑬쑴쑵쑹쒀쒔쒜쒸쒼쓩쓰쓱쓴쓸쓺쓿씀씁씌\
					씐씔씜씨씩씬씰씸씹씻씽아악안앉않알앍앎앓암압앗았앙앝앞애액앤앨앰앱앳앴앵야약얀얄얇얌얍얏양얕얗얘얜얠얩어억언\
					얹얻얼얽얾엄업없엇었엉엊엌엎에엑엔엘엠엡엣엥여역엮연열엶엷염엽엾엿였영옅옆옇예옌옐옘옙옛옜오옥온올옭옮옰옳옴\
					옵옷옹옻와왁완왈왐왑왓왔왕왜왝왠왬왯왱외왹왼욀욈욉욋욍요욕욘욜욤욥욧용우욱운울욹욺움웁웃웅워웍원월웜웝웠웡웨\
					웩웬웰웸웹웽위윅윈윌윔윕윗윙유육윤율윰윱윳융윷으윽은을읊음읍읏응읒읓읔읕읖읗의읜읠읨읫이익인일읽읾잃임입잇있\
					잉잊잎자작잔잖잗잘잚잠잡잣잤장잦재잭잰잴잼잽잿쟀쟁쟈쟉쟌쟎쟐쟘쟝쟤쟨쟬저적전절젊점접젓정젖제젝젠젤젬젭젯젱져\
					젼졀졈졉졌졍졔조족존졸졺좀좁좃종좆좇좋좌좍좔좝좟좡좨좼좽죄죈죌죔죕죗죙죠죡죤죵주죽준줄줅줆줌줍줏중줘줬줴쥐쥑\
					쥔쥘쥠쥡쥣쥬쥰쥴쥼즈즉즌즐즘즙즛증지직진짇질짊짐집짓징짖짙짚짜짝짠짢짤짧짬짭짯짰짱째짹짼쨀쨈쨉쨋쨌쨍쨔쨘쨩쩌\
					쩍쩐쩔쩜쩝쩟쩠쩡쩨쩽쪄쪘쪼쪽쫀쫄쫌쫍쫏쫑쫓쫘쫙쫠쫬쫴쬈쬐쬔쬘쬠쬡쭁쭈쭉쭌쭐쭘쭙쭝쭤쭸쭹쮜쮸쯔쯤쯧쯩찌찍찐찔찜\
					찝찡찢찧차착찬찮찰참찹찻찼창찾채책챈챌챔챕챗챘챙챠챤챦챨챰챵처척천철첨첩첫첬청체첵첸첼쳄쳅쳇쳉쳐쳔쳤쳬쳰촁초\
					촉촌촐촘촙촛총촤촨촬촹최쵠쵤쵬쵭쵯쵱쵸춈추축춘출춤춥춧충춰췄췌췐취췬췰췸췹췻췽츄츈츌츔츙츠측츤츨츰츱츳층치칙\
					친칟칠칡침칩칫칭카칵칸칼캄캅캇캉캐캑캔캘캠캡캣캤캥캬캭컁커컥컨컫컬컴컵컷컸컹케켁켄켈켐켑켓켕켜켠켤켬켭켯켰켱\
					켸코콕콘콜콤콥콧콩콰콱콴콸쾀쾅쾌쾡쾨쾰쿄쿠쿡쿤쿨쿰쿱쿳쿵쿼퀀퀄퀑퀘퀭퀴퀵퀸퀼큄큅큇큉큐큔큘큠크큭큰클큼큽킁키\
					킥킨킬킴킵킷킹타탁탄탈탉탐탑탓탔탕태택탠탤탬탭탯탰탱탸턍터턱턴털턺텀텁텃텄텅테텍텐텔템텝텟텡텨텬텼톄톈토톡톤\
					톨톰톱톳통톺톼퇀퇘퇴퇸툇툉툐투툭툰툴툼툽툿퉁퉈퉜퉤튀튁튄튈튐튑튕튜튠튤튬튱트특튼튿틀틂틈틉틋틔틘틜틤틥티틱틴\
					틸팀팁팃팅파팍팎판팔팖팜팝팟팠팡팥패팩팬팰팸팹팻팼팽퍄퍅퍼퍽펀펄펌펍펏펐펑페펙펜펠펨펩펫펭펴편펼폄폅폈평폐폘\
					폡폣포폭폰폴폼폽폿퐁퐈퐝푀푄표푠푤푭푯푸푹푼푿풀풂품풉풋풍풔풩퓌퓐퓔퓜퓟퓨퓬퓰퓸퓻퓽프픈플픔픕픗피픽핀필핌핍\
					핏핑하학한할핥함합핫항해핵핸핼햄햅햇했행햐향허헉헌헐헒험헙헛헝헤헥헨헬헴헵헷헹혀혁현혈혐협혓혔형혜혠혤혭호혹\
					혼홀홅홈홉홋홍홑화확환활홧황홰홱홴횃횅회획횐횔횝횟횡효횬횰횹횻후훅훈훌훑훔훗훙훠훤훨훰훵훼훽휀휄휑휘휙휜휠휨\
					휩휫휭휴휵휸휼흄흇흉흐흑흔흖흗흘흙흠흡흣흥흩희흰흴흼흽힁히힉힌힐힘힙힛힝';
	
	var str_size = str.length;
	var chk = 0;
	for (i = 0; i < str_size; i++)
	{
		chk = 0;
		var v = str.charAt(i);
		
		for (j = 0; j < useTextEn.length; j++)
		{
			var v2 = useTextEn.charAt(j);
			if (v == v2)
			{
				chk++;
				break;
			}
		}
		
		for (j = 0; j < useTextKr.length; j++)
		{
			var v2 = useTextKr.charAt(j);
			if (v == v2)
			{
				chk++;
				break;
			}
		}
		
		if (chk == 0) {
			return false;
			break;
		}
	}
	return true;
	//return !(/[~!@\#?$%^&*\()\-=+_']/gi).test(str);
}

/**
 * AS-IS ID checker
 *  @param str : id string
 *  @param type : A - ASIS 유저를 위한 valid check 메세지
 *  						  B or undefined - email 과 ASIS 유저를 위한 valid check 메세지
 *   - void exceptSpace(jquery object) : 공백 제거
 *   - void maxLengthNumber(jquery object) : input type - number field 의 maxlength 제한. 반드시 해당 노드에 maxlength 속성이 있어야함.
 */
ParamValidate.isAsIsId = function(str, type) {
	var ret_code = "";
	var ret_message = "";
//	if(this.isAlphabet(str)) {
		if(this.isAlphaNumber(str)) {
			if(str.length > 3) {
				if(str.indexOf(" ") == -1) {
					ret_code = "001";	// 정상
				}else{
					ret_code = "904";	// 아이디에 공백이 포함될 수 없습니다.
					if(type == 'A') ret_message = "아이디는 공백이 포함될 수 없습니다.";
					else ret_message = "아이디는 이메일 형식이거나 공백이 포함될 수 없습니다.";
				}
			}else{
				ret_code = "903";		// 아이디는 4글자 이상이어야 합니다. 아이디를 다시 입력해 주세요.
				if(type == 'A') ret_message = "아이디는 4글자 이상이어야 합니다.";
				else ret_message = "아이디는 이메일 형식이거나 4글자 이상이어야 합니다.";
			}
		}else{
			ret_code = "902";			// 아이디는 영문자와 숫자로만 이루어져야 합니다. 아이디를 다시 입력해 주세요.
			if(type == 'A')  ret_message = "아이디는 영문자와 숫자로만 이루어져야 합니다.";
			else ret_message = "아이디는 이메일 형식이거나 영문자와 숫자로만 이루어져야 합니다.";
		}
//	}else{
//		ret_code = "901";				// 아이디의 첫글자는 영문자여야 합니다.
//		if(type == 'A') ret_message = "아이디의 첫글자는 영문자여야 합니다.";
//		else  ret_message = "아이디는 이메일 형식이거나 첫글자는 영문자여야 합니다.";
//	}
	
	return {
		ret_code : ret_code,
		ret_message : ret_message
	};
}

/**
 * Watcher
 *   - boolean onlyNumber(event, jquery object) : 숫자만 입력가능
 *   - void onlyNumber(jquery object) : 특수문자 제거
 *   - void exceptSpace(jquery object) : 공백 제거
 *   - void maxLengthNumber(jquery object) : input type - number field 의 maxlength 제한. 반드시 해당 노드에 maxlength 속성이 있어야함.
 */
ParamValidate.watcher = {
	onlyNumber : function(e, o) {
		var ret = true;
		e = e || window.e;
		var keyID = (e.which) ? e.which : e.keyCode;
		if ( (keyID >= 48 && keyID <= 57) || (keyID >= 96 && keyID <= 105) || keyID == 8 || keyID == 46 || keyID == 37 || keyID == 39 || keyID == 9 || keyID == 13) {
			return false;
		}else {
			$(o).val($(o).val().slice(0,-1));
		}
		return ret;
	},
	exceptSpCharacters : function(o, e) {
		e = e || window.e;
		var keyID = (e.which) ? e.which : e.keyCode;
		if ( (keyID >= 48 && keyID <= 57) || (keyID >= 96 && keyID <= 105) || keyID == 8 || keyID == 46 || keyID == 37 || keyID == 39 || keyID == 9) 
			return true;
		else {
			re = /[~!@\#$%^&*\()\-=+_']/gi;
			var temp=$(o).val();
			
			if(re.test(temp)) { //특수문자가 포함되면 삭제하여 값으로 다시셋팅
				$(o).val(temp.replace(re,""));
			}
		}
	},
	exceptSpace : function(o, e) {
		e = e || window.e;
		var keyID = (e.which) ? e.which : e.keyCode;
		if ( (keyID >= 48 && keyID <= 57) || (keyID >= 96 && keyID <= 105) || keyID == 46 || keyID == 37 || keyID == 39 || keyID == 9) {
			return true;
		}
		else {
			if(keyID == 32) {
				var temp=$(o).val();
				$(o).val(temp.replace(/ /gi, ''));
			}
		}
	},
	maxLengthNumber : function(o) {
		if ($(o).val().length > Number($(o).attr('maxlength'))) {
			$(o).val($(o).val().slice(0, $(o).attr('maxlength')));
		}
	}
};

