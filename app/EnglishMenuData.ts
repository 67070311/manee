export type CountryId="thailand"|"korea"|"japan"|"italy";
export type Vocabulary={id:string;en:string;th:string;kind:"ingredient"|"tool";note?:string};
export type RecipeInstruction={en:string;th:string};
export type MiniStep={kind:"add"|"heat"|"stir";en:string;th:string;answer?:string;choices?:string[];verb:string;verbTh:string};
export type EnglishMenuDish={id:string;country:CountryId;name:string;thaiName:string;subtitle:string;subtitleTh:string;level:"Beginner"|"Intermediate";minutes:number;ingredients:string[];tools:string[];instructions:RecipeInstruction[];miniSteps:MiniStep[]};
export const countries:{id:CountryId;en:string;th:string;symbol:string}[]=[
 {id:"thailand",en:"Thailand",th:"ไทย",symbol:"TH"},
 {id:"japan",en:"Japan",th:"ญี่ปุ่น",symbol:"JP"},
 {id:"korea",en:"South Korea",th:"เกาหลี",symbol:"KR"},
 {id:"italy",en:"Italy",th:"อิตาลี",symbol:"IT"}
];
const I=(id:string,en:string,th:string,note?:string):Vocabulary=>({id,en,th,kind:"ingredient",note});
const T=(id:string,en:string,th:string,note?:string):Vocabulary=>({id,en,th,kind:"tool",note});
export const vocabulary:Record<string,Vocabulary>={
 rice:I("rice","Rice","ข้าว"),
 egg:I("egg","Egg","ไข่"),
 carrot:I("carrot","Carrot","แคร์รอต"),
 spinach:I("spinach","Spinach","ผักปวยเล้ง"),
 beef:I("beef","Beef","เนื้อวัว"),
 gochujang:I("gochujang","Gochujang","โคชูจัง (ซอสพริกเกาหลี)","Korean fermented chili paste"),
 kimchi:I("kimchi","Kimchi","กิมจิ","Korean fermented vegetables"),
 tofu:I("tofu","Tofu","เต้าหู้"),
 broth:I("broth","Broth","น้ำซุป"),
 scallion:I("scallion","Green onion","ต้นหอม"),
 mushroom:I("mushroom","Mushroom","เห็ด"),
 pork:I("pork","Pork","เนื้อหมู"),
 noodles:I("noodles","Rice noodles","เส้นก๋วยเตี๋ยว"),
 shrimp:I("shrimp","Shrimp","กุ้ง"),
 sprouts:I("sprouts","Bean sprouts","ถั่วงอก"),
 lime:I("lime","Lime","มะนาว"),
 fishsauce:I("fishsauce","Fish sauce","น้ำปลา"),
 tamarind:I("tamarind","Tamarind paste","น้ำมะขามเปียก"),
 lemongrass:I("lemongrass","Lemongrass","ตะไคร้"),
 galangal:I("galangal","Galangal","ข่า"),
 ginger:I("ginger","Ginger","ขิง"),
 kaffir:I("kaffir","Makrut lime leaves","ใบมะกรูด"),
 chili:I("chili","Chili","พริก"),
 flour:I("flour","Flour","แป้งสาลี"),
 water:I("water","Water","น้ำ"),
 oil:I("oil","Cooking oil","น้ำมันพืช"),
 salt:I("salt","Salt","เกลือ"),
 sweetpotato:I("sweetpotato","Sweet potato","มันเทศ"),
 dashi:I("dashi","Dashi","น้ำซุปดาชิ"),
 miso:I("miso","Miso paste","มิโสะ"),
 wakame:I("wakame","Wakame","สาหร่ายวากาเมะ"),
 pasta:I("pasta","Pasta","พาสต้า"),
 tomato:I("tomato","Tomato","มะเขือเทศ"),
 garlic:I("garlic","Garlic","กระเทียม"),
 basil:I("basil","Basil","ใบโหระพา"),
 parmesan:I("parmesan","Parmesan","พาร์เมซานชีส"),
 dough:I("dough","Pizza dough","แป้งพิซซ่า"),
 mozzarella:I("mozzarella","Mozzarella","มอสซาเรลลาชีส"),
 sauce:I("sauce","Tomato sauce","ซอสมะเขือเทศ"),
 bowl:T("bowl","Bowl","ชาม"),
 stonebowl:T("stonebowl","Stone bowl","ชามหินร้อน"),
 pan:T("pan","Frying pan","กระทะ"),
 pot:T("pot","Pot","หม้อ"),
 wok:T("wok","Wok","กระทะก้นลึก"),
 spoon:T("spoon","Spoon","ช้อน"),
 knife:T("knife","Knife","มีด"),
 board:T("board","Cutting board","เขียง"),
 ladle:T("ladle","Ladle","กระบวย"),
 spatula:T("spatula","Spatula","ตะหลิว"),
 strainer:T("strainer","Mesh strainer","กระชอนตะแกรงกรอง"),
 skimmer:T("skimmer","Skimmer","กระชอนตักของทอด"),
 whisk:T("whisk","Whisk","ตะกร้อมือ"),
 oven:T("oven","Oven","เตาอบ"),
 bakingtray:T("bakingtray","Baking tray","ถาดอบ")
};
export const dishes:EnglishMenuDish[]=[
 {
 id:"pad-thai",country:"thailand",name:"Pad Thai",thaiName:"ผัดไทย",subtitle:"Sweet, tangy rice noodles",subtitleTh:"เส้นผัดซอสเปรี้ยวหวาน",level:"Beginner",minutes:20,
 ingredients:["noodles","shrimp","egg","sprouts","lime","tamarind","fishsauce"],tools:["wok","spatula","bowl","strainer"],
 instructions:[
 {en:"Soak the rice noodles until they soften.",th:"แช่เส้นก๋วยเตี๋ยวจนนิ่ม"},
 {en:"Mix the tamarind paste and fish sauce to make a sauce.",th:"ผสมน้ำมะขามเปียกกับน้ำปลาเป็นซอส"},
 {en:"Stir-fry the shrimp, then add the egg.",th:"ผัดกุ้งก่อน แล้วใส่ไข่"},
 {en:"Add the noodles and sauce. Toss everything together.",th:"ใส่เส้นและซอส คลุกเคล้าให้เข้ากัน"},
 {en:"Serve with bean sprouts and lime.",th:"เสิร์ฟพร้อมถั่วงอกและมะนาว"}
 ],
 miniSteps:[
 {kind:"add",en:"Add the rice noodles to the wok.",th:"ใส่เส้นก๋วยเตี๋ยวลงในกระทะ",answer:"noodles",choices:["noodles","rice","pasta"],verb:"Add",verbTh:"ใส่"},
 {kind:"add",en:"Add the shrimp.",th:"ใส่กุ้งลงไป",answer:"shrimp",choices:["shrimp","carrot","tofu"],verb:"Add",verbTh:"ใส่"},
 {kind:"stir",en:"Stir-fry the ingredients.",th:"ผัดส่วนผสมให้เข้ากัน",verb:"Stir-fry",verbTh:"ผัด"}
 ]
 },
 {
 id:"tom-yum",country:"thailand",name:"Tom Yum Goong",thaiName:"ต้มยำกุ้ง",subtitle:"A fragrant hot-and-sour soup",subtitleTh:"ซุปรสเปรี้ยวเผ็ดหอมสมุนไพร",level:"Beginner",minutes:25,
 ingredients:["shrimp","mushroom","lemongrass","galangal","kaffir","lime","fishsauce"],tools:["pot","ladle","knife","board"],
 instructions:[
 {en:"Bring the broth to a gentle boil.",th:"ต้มน้ำซุปให้เดือดเบา ๆ"},
 {en:"Add lemongrass, galangal and makrut lime leaves.",th:"ใส่ตะไคร้ ข่า และใบมะกรูด"},
 {en:"Add the mushrooms and shrimp. Simmer until cooked.",th:"ใส่เห็ดและกุ้ง เคี่ยวเบา ๆ จนสุก"},
 {en:"Season with fish sauce and lime juice.",th:"ปรุงด้วยน้ำปลาและน้ำมะนาว"}
 ],
 miniSteps:[
 {kind:"add",en:"Add the lemongrass.",th:"ใส่ตะไคร้",answer:"lemongrass",choices:["lemongrass","scallion","basil"],verb:"Add",verbTh:"ใส่"},
 {kind:"add",en:"Add the shrimp to the pot.",th:"ใส่กุ้งลงในหม้อ",answer:"shrimp",choices:["shrimp","beef","pasta"],verb:"Add",verbTh:"ใส่"},
 {kind:"heat",en:"Bring the soup to a gentle boil.",th:"ต้มน้ำซุปให้เดือดเบา ๆ",verb:"Boil",verbTh:"ต้ม"}
 ]
 },
 {
 id:"bibimbap",country:"korea",name:"Bibimbap",thaiName:"บิบิมบับ",subtitle:"Colorful Korean mixed rice",subtitleTh:"ข้าวยำเกาหลีหลากสี",level:"Beginner",minutes:25,
 ingredients:["rice","egg","carrot","spinach","beef","gochujang"],tools:["stonebowl","pan","spoon","knife","board"],
 instructions:[
 {en:"Cook the rice and prepare the vegetables.",th:"หุงข้าวและเตรียมผัก"},
 {en:"Sauté the beef and vegetables separately.",th:"ผัดเนื้อและผักแยกกัน"},
 {en:"Place the rice in a bowl and arrange the toppings.",th:"ใส่ข้าวในชามและจัดเครื่องเคียงด้านบน"},
 {en:"Add a fried egg and gochujang. Mix before eating.",th:"โปะไข่ดาวและโคชูจัง แล้วคลุกก่อนรับประทาน"}
 ],
 miniSteps:[
 {kind:"add",en:"Put the rice into the bowl.",th:"ใส่ข้าวลงในชาม",answer:"rice",choices:["rice","noodles","flour"],verb:"Put",verbTh:"ใส่"},
 {kind:"add",en:"Place the egg on top.",th:"วางไข่ไว้ด้านบน",answer:"egg",choices:["egg","mushroom","shrimp"],verb:"Place",verbTh:"วาง"},
 {kind:"stir",en:"Mix everything together.",th:"คลุกส่วนผสมให้เข้ากัน",verb:"Mix",verbTh:"คลุก"}
 ]
 },
 {
 id:"kimchi-jjigae",country:"korea",name:"Kimchi Jjigae",thaiName:"ซุปกิมจิ",subtitle:"A comforting spicy kimchi stew",subtitleTh:"ซุปกิมจิรสเข้มข้น",level:"Beginner",minutes:30,
 ingredients:["kimchi","tofu","pork","broth","scallion","mushroom"],tools:["pot","ladle","knife","board"],
 instructions:[
 {en:"Sauté the kimchi and pork in a pot.",th:"ผัดกิมจิและหมูในหม้อ"},
 {en:"Pour in the broth and bring it to a simmer.",th:"เทน้ำซุปลงไปแล้วเคี่ยวเบา ๆ"},
 {en:"Add tofu and mushrooms. Cook until heated through.",th:"ใส่เต้าหู้และเห็ด ต้มจนร้อนทั่ว"},
 {en:"Sprinkle green onion on top before serving.",th:"โรยต้นหอมก่อนเสิร์ฟ"}
 ],
 miniSteps:[
 {kind:"add",en:"Add the kimchi to the pot.",th:"ใส่กิมจิลงในหม้อ",answer:"kimchi",choices:["kimchi","carrot","pasta"],verb:"Add",verbTh:"ใส่"},
 {kind:"add",en:"Add the tofu cubes.",th:"ใส่เต้าหู้หั่นเต๋า",answer:"tofu",choices:["tofu","egg","shrimp"],verb:"Add",verbTh:"ใส่"},
 {kind:"heat",en:"Simmer the stew gently.",th:"เคี่ยวซุปด้วยไฟอ่อน",verb:"Simmer",verbTh:"เคี่ยวไฟอ่อน"}
 ]
 },
 {
 id:"tempura",country:"japan",name:"Shrimp Tempura",thaiName:"เทมปุระกุ้ง",subtitle:"Crispy Japanese fried shrimp",subtitleTh:"กุ้งชุบแป้งทอดกรอบสไตล์ญี่ปุ่น",level:"Intermediate",minutes:25,
 ingredients:["shrimp","flour","water","oil","sweetpotato","ginger"],tools:["bowl","whisk","pot","skimmer","knife","board"],
 instructions:[
 {en:"Mix cold water and flour into a light batter.",th:"ผสมน้ำเย็นกับแป้งให้เป็นแป้งชุบทอด"},
 {en:"Pat the shrimp dry and dip them in the batter.",th:"ซับกุ้งให้แห้งแล้วชุบแป้ง"},
 {en:"Carefully fry the shrimp in hot oil until crisp.",th:"ทอดกุ้งในน้ำมันร้อนอย่างระมัดระวังจนกรอบ"},
 {en:"Drain the tempura on a rack or paper towel.",th:"พักเทมปุระให้สะเด็ดน้ำมัน"},
 {en:"Serve with grated ginger on the side, if you like.",th:"เสิร์ฟพร้อมขิงขูดด้านข้างตามชอบ"}
 ],
 miniSteps:[
 {kind:"add",en:"Choose the flour for the batter.",th:"เลือกแป้งสำหรับชุบทอด",answer:"flour",choices:["flour","salt","rice"],verb:"Choose",verbTh:"เลือก"},
 {kind:"add",en:"Coat the shrimp with the batter.",th:"ชุบกุ้งด้วยแป้ง",answer:"shrimp",choices:["shrimp","pork","tomato"],verb:"Coat",verbTh:"ชุบ"},
 {kind:"heat",en:"Fry the shrimp until golden.",th:"ทอดกุ้งจนเหลืองกรอบ",verb:"Fry",verbTh:"ทอด"}
 ]
 },
 {
 id:"miso-soup",country:"japan",name:"Miso Soup",thaiName:"ซุปมิโสะ",subtitle:"A warm everyday Japanese soup",subtitleTh:"ซุปมิโสะหอมกลมกล่อม",level:"Beginner",minutes:15,
 ingredients:["dashi","miso","tofu","wakame","scallion"],tools:["pot","ladle","bowl","spoon"],
 instructions:[
 {en:"Warm the dashi broth in a pot.",th:"อุ่นน้ำซุปดาชิในหม้อ"},
 {en:"Lower the heat and dissolve the miso paste.",th:"ลดไฟแล้วละลายมิโสะลงในน้ำซุป"},
 {en:"Add tofu and wakame. Gently warm the soup.",th:"ใส่เต้าหู้และสาหร่ายวากาเมะแล้วอุ่นเบา ๆ"},
 {en:"Serve with sliced green onion. Do not boil after adding miso.",th:"เสิร์ฟพร้อมต้นหอมซอย และไม่ควรต้มเดือดหลังเติมมิโสะ"}
 ],
 miniSteps:[
 {kind:"add",en:"Add the miso paste to the broth.",th:"เติมมิโสะลงในน้ำซุป",answer:"miso",choices:["miso","gochujang","tamarind"],verb:"Add",verbTh:"เติม"},
 {kind:"add",en:"Add the tofu cubes.",th:"ใส่เต้าหู้หั่นเต๋า",answer:"tofu",choices:["tofu","shrimp","pork"],verb:"Add",verbTh:"ใส่"},
 {kind:"stir",en:"Stir gently to dissolve the miso.",th:"คนเบา ๆ ให้มิโสะละลาย",verb:"Stir",verbTh:"คน"}
 ]
 },
 {
 id:"spaghetti",country:"italy",name:"Tomato Spaghetti",thaiName:"สปาเกตตีซอสมะเขือเทศ",subtitle:"Pasta with bright tomato sauce",subtitleTh:"พาสตาคลุกซอสมะเขือเทศ",level:"Beginner",minutes:25,
 ingredients:["pasta","tomato","garlic","basil","parmesan","oil"],tools:["pot","pan","strainer","spoon"],
 instructions:[
 {en:"Boil the pasta in salted water until al dente.",th:"ต้มพาสตาในน้ำเกลือจนสุกแบบยังมีความหนึบ"},
 {en:"Cook the garlic and tomatoes into a sauce.",th:"ผัดกระเทียมและมะเขือเทศให้เป็นซอส"},
 {en:"Toss the drained pasta with the sauce.",th:"นำพาสต้าที่สะเด็ดน้ำมาคลุกกับซอส"},
 {en:"Finish with basil and Parmesan.",th:"โรยใบโหระพาและพาร์เมซาน"}
 ],
 miniSteps:[
 {kind:"add",en:"Choose the pasta.",th:"เลือกเส้นพาสตา",answer:"pasta",choices:["pasta","rice","noodles"],verb:"Choose",verbTh:"เลือก"},
 {kind:"add",en:"Add the tomato sauce.",th:"เติมซอสมะเขือเทศ",answer:"sauce",choices:["sauce","miso","gochujang"],verb:"Add",verbTh:"เติม"},
 {kind:"stir",en:"Toss the pasta with the sauce.",th:"คลุกพาสตากับซอส",verb:"Toss",verbTh:"คลุก"}
 ]
 },
 {
 id:"margherita",country:"italy",name:"Margherita Spaghetti",thaiName:"สปาเกตตีมาเกริตา",subtitle:"Spaghetti with tomato, mozzarella and basil",subtitleTh:"สปาเกตตีซอสมะเขือเทศกับมอสซาเรลลาและใบโหระพา",level:"Beginner",minutes:25,
 ingredients:["pasta","tomato","sauce","mozzarella","basil","garlic","oil"],tools:["pot","pan","strainer","spoon"],
 instructions:[
 {en:"Boil the spaghetti in salted water until al dente.",th:"ต้มเส้นสปาเกตตีในน้ำเกลือจนสุกกำลังดี"},
 {en:"Sauté the garlic in olive oil and add the tomato sauce.",th:"ผัดกระเทียมในน้ำมันมะกอก แล้วเติมซอสมะเขือเทศ"},
 {en:"Toss the spaghetti with the warm sauce.",th:"คลุกเส้นสปาเกตตีกับซอสอุ่น ๆ"},
 {en:"Add mozzarella and fresh basil before serving.",th:"ใส่มอสซาเรลลาและใบโหระพาสดก่อนเสิร์ฟ"}
 ],
 miniSteps:[
 {kind:"add",en:"Choose the spaghetti.",th:"เลือกเส้นสปาเกตตี",answer:"pasta",choices:["pasta","rice","dough"],verb:"Choose",verbTh:"เลือก"},
 {kind:"add",en:"Add the mozzarella cheese.",th:"ใส่มอสซาเรลลาชีส",answer:"mozzarella",choices:["mozzarella","tofu","miso"],verb:"Add",verbTh:"ใส่"},
 {kind:"stir",en:"Toss the spaghetti with the sauce.",th:"คลุกเส้นสปาเกตตีกับซอส",verb:"Toss",verbTh:"คลุก"}
 ]
 }
];
export const countryName=(id:CountryId,language:"en"|"th")=>{
 const item=countries.find(country=>country.id===id);
 return item?.[language]??id;
};
// Uploaded dish illustrations for all eight food menus.
const uploadedDishImages:Record<string,string>={
 "pad-thai":"pad-thai",
 "tom-yum":"tom-yum-kung",
 "bibimbap":"bibimbup",
 "kimchi-jjigae":"kimchi-soup",
 "tempura":"tempura-shrimp",
 "miso-soup":"miso-soup",
 "spaghetti":"tomato-spagetti",
 "margherita":"megharita-spagetti",
};
export const illustration=(id:string)=>{
 const filename=uploadedDishImages[id];
 return filename
  ? "/playground/PG-EngMenu/Food-img/"+filename+".webp"
  : "/playground/english-menu/dishes/"+id+".webp";
};
// Use user-supplied illustrations for the ingredients already provided.
const uploadedIngredientImages:Record<string,string>={
 "garlic":"garlic",
 "sprouts":"bean-sprout",
 "egg":"egg",
 "fishsauce":"fish-sauce",
 "lime":"lemon",
 "noodles":"noodles",
 "shrimp":"shrimp",
 "flour":"dough", // Supplied asset depicts flour in a bowl, not kneaded dough.
 "kaffir":"kaffir-lime-leaves",
 "lemongrass":"lemon-grass",
 "mushroom":"mushroom",
 "water":"water",
 "dashi":"dachi",
 "galangal":"galangal",
 "ginger":"ginger",
 "miso":"miso",
 "oil":"plant-oil",
 "rice":"rice",
 "scallion":"spring-onion",
 "sweetpotato":"sweet-potato",
 "tamarind":"tamarind-pulp",
 "tofu":"tofu",
 "wakame":"wagame",
 "carrot":"carrot",
 "kimchi":"kimchi",
 "gochujang":"kochujung",
 "beef":"meat",
 "mozzarella":"mozerala-scheese",
 "parmesan":"pamesa-cheese",
 "pork":"pork",
 "spinach":"spinach",
 "basil":"thai-basil-leaves",
 "sauce":"tomato-sauce",
 "pasta":"pasta",
 "broth":"soup",
 "tomato":"tomato",
};
// Each uploaded kitchen utensil was checked visually and given a descriptive filename.
// A perforated skimmer and a mesh strainer are different utensils.
const uploadedKitchenwareImages:Record<string,string>={
 "stonebowl":"stone-bowl",
 "strainer":"mesh-strainer",
 "pan":"frying-pan",
 "board":"cutting-board",
 "spatula":"spatula",
 "skimmer":"skimmer",
 "ladle":"ladle",
 "whisk":"whisk",
 "spoon":"spoon",
 "bowl":"bowl",
 "wok":"wok",
 "knife":"knife",
 "pot":"pot",
};
export const vocabImage=(id:string)=>{
 const ingredient=uploadedIngredientImages[id];
 if(ingredient)return "/playground/PG-EngMenu/INGREDIENTS/"+ingredient+".webp";
 const utensil=uploadedKitchenwareImages[id];
 if(utensil)return "/playground/PG-EngMenu/KITCHENWARE/"+utensil+".webp";
 return "/playground/english-menu/vocab/"+id+".webp";
};
