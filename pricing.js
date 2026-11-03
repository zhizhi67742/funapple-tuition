const COURSES={
 '0':{name:'不選課程（僅其他費用）',type:'none',price:0,materials:0},
 '3800':{name:'ESL 每週 1 日',type:'esl',price:3800,termPrice:16800,materials:2000,matUnit:'學期'},
 '6800':{name:'ESL 每週 2 日',type:'esl',price:6800,materials:3500,matUnit:'學期'},
 '9800':{name:'ESL 每週 3 日',type:'esl',price:9800,materials:3500,matUnit:'學期'},
 '12000':{name:'ESL 每週 4 日',type:'esl',price:12000,materials:4000,matUnit:'學期'},
 careOnly:{name:'純課輔',type:'care',price:6500,materials:0},
 cambridge:{name:'劍橋英檢班',type:'half',price:24000,materials:2000,matUnit:'年'},
 ket:{name:'KET/GEPT(初級)',type:'half',price:24000,materials:2000,matUnit:'年'},
 pet:{name:'PET/GEPT(中級)',type:'half',price:26000,materials:2000,matUnit:'年'},
 pre:{name:'Pre班',type:'monthly',price:3800,termPrice:16800,materials:2000,matUnit:'學期'},
 weekend:{name:'假日會話閱讀班',type:'monthly',price:3800,termPrice:16800,materials:2000,matUnit:'學期'},
 music:{name:'雙語音樂班',type:'scheme',materials:2000,matUnit:'學期',schemes:[{name:'單堂',price:400,unit:'堂'},{name:'10 堂方案',price:4000,unit:'組（10 堂）'}]},
 art:{name:'話畫工作室',type:'scheme',materials:0,matNote:'方案價格已含教材，不另收教材費。',schemes:[{name:'16 堂方案',price:8300,unit:'期（16 堂）'},{name:'32 堂方案',price:16100,unit:'期（32 堂）'}]},
 toeic:{name:'成人多益班',type:'scheme',materials:600,matUnit:'期',schemes:[{name:'一期 24 堂',price:19200,unit:'期（24 堂）',note:'$800／堂 × 24 堂＝$19,200／期'},{name:'依堂數計算',price:800,unit:'堂'}]},
 grammar:{name:'成人文法班',type:'scheme',materials:1000,matUnit:'期',schemes:[{name:'一期 24 堂',price:15600,unit:'期（24 堂）',note:'$650／堂 × 24 堂＝$15,600／期'},{name:'依堂數計算',price:650,unit:'堂'}]},
 phonics:{name:'雙語正音班',type:'scheme',schemes:[{name:'完整班（國英數）',price:5600,materials:800,unit:'期（26 堂）',note:'每週 3 堂；完整班共 26 堂。'},{name:'英文班（9 堂）',price:3500,materials:500,unit:'期（9 堂）',note:'每週 1 堂，共 9 堂；2027 年 5、6 月上課。'},{name:'國數班（16 堂）',price:3500,materials:500,unit:'期（16 堂）',note:'每週 2 堂，共 16 堂；2027 年 5、6 月上課。'}]},
 camp:{name:'寒令營',type:'camp',schemes:[{name:'原價',price:15800,materials:1000,meal:1300,unit:'方案'},{name:'班外生早鳥',price:11500,materials:1000,meal:1300,unit:'方案'},{name:'班內生早鳥',price:10500,materials:1000,meal:1300,unit:'方案'},{name:'ESL課程（下午）',price:9200,materials:600,meal:null,unit:'方案'},{name:'全日課輔中師主題',price:8600,materials:600,meal:1300,unit:'方案'},{name:'單周',price:6500,materials:600,meal:650,unit:'週'}]}
};
function quote(v){const c=COURSES[v.course],s=c.schemes?.[v.scheme]||c,fixedTerm=!!c.termPrice&&v.billing==='term'&&Math.abs(v.months-4.66)<.005,monthly=['esl','monthly','care'].includes(c.type)&&!fixedTerm,discount=c.type==='esl'&&!c.termPrice&&v.billing==='term'&&Math.abs(v.months-4.66)<.005?(v.course==='12000'?.92:.95):1;
 const rawBase=(fixedTerm?c.termPrice:s.price)*(monthly?v.months:c.type==='none'?0:v.units)*discount,base=Math.round(rawBase),sibling=siblingRule(v),tuition=sibling.apply?Math.round(rawBase*.9):base,siblingDiscount=base-tuition;
 const issues=[];
 const careRate=c.type==='care'||(v.course==='cambridge'&&v.care==='auto')?6500:(c.type==='esl'||['pre','weekend'].includes(v.course))&&v.care==='auto'?(v.course==='12000'?5000:['6800','9800'].includes(v.course)?5500:6000):0;
 const materialCount=c.matUnit==='期'?(s.unit==='堂'?Math.ceil(v.units/24):v.units):fixedTerm?v.units:v.materialPeriods??1;
 const careMonths=v.course==='cambridge'||(fixedTerm&&(c.type==='esl'||['pre','weekend'].includes(v.course)))?(v.careMonths??4.66):v.months,careTerms=v.careTerms??1,careDiscount=v.course==='cambridge'&&v.care==='auto'?2000*careTerms:0;
 const care=c.type==='care'?0:Math.round(careRate*careMonths),materials=v.chargeMaterials?(s.materials??c.materials??0)*materialCount:0,careMaterials=careRate&&v.chargeCareMaterials?2000*careTerms:0;
 const meal=c.type==='camp'?(s.meal===null?(v.meal===''||v.meal==null?(issues.push('請填入此營隊方案的實際餐費，不收費請填 0。'),0):+v.meal):s.meal*v.units):0;
 const snackRate=v.snackMode==='single'?40:600,transportRate=v.transportMode==='single'?60:v.school==='新光'?0:600,snack=c.type==='camp'||v.snackMode==='none'?0:Math.round(snackRate*v.snackQuantity),transport=v.transportMode==='none'?0:Math.round(transportRate*v.transportQuantity);
 if(careDiscount>care)issues.push('課輔學期減免不可超過課輔學費，請確認計費月數與優惠學期數。');
 const before=tuition+care-careDiscount+materials+careMaterials;if(v.reduction>before)issues.push('減免金額不可超過學費及教材費小計。');const payable=before-v.reduction+transport+meal,total=payable+snack,p=payable;
 return {c,s,sibling,siblingDiscount,fixedTerm,materialCount,monthly,discount,base,tuition,careRate,care,careMonths,careTerms,careDiscount,materials,careMaterials,meal,snackRate,transportRate,snack,transport,payable,total,issues,payments:[payable]};
}

function siblingRule(v){return {apply:!!v.siblingEnabled,message:''};}
