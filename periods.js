function checkPeriods(v,r){const rows=[],warnings=[];let target=null,basis='';
 if(r.monthly){target=v.months;basis=`課程按 ${v.months} 個月計費。`;rows.push(['課程',`${v.months} 個月`]);}
 else if(r.fixedTerm){target=v.months;basis=`本次期繳期間 ${target} 個月，學費固定 $16,800。`;rows.push(['課程',`${target} 個月`]);}
 else if(r.c.type==='half'){target=6;basis='本次收取完整半年學費，期間 6 個月。';rows.push(['課程',`${target} 個月`]);}
 else {basis='本課程按堂數／方案收費，不能直接換算服務月數。';if(r.c.type!=='none')rows.push(['課程',`${v.units} ${r.s.unit||'方案'}`]);else basis='本次只計其他費用，請核對各服務的期間。';}
 function monthlyRow(label,months){rows.push([label,`${months} 個月`]);if(target!==null&&Math.abs(months-target)>.005)warnings.push(`${label}為 ${months} 個月，與課程基準 ${target} 個月不同。`);}
 if(r.careRate){if(r.c.type==='care')rows.push(['課輔',`${v.months} 個月`]);else monthlyRow('搭配課輔',r.careMonths);if(v.chargeCareMaterials)rows.push(['課輔教材',`${r.careTerms} 學期`]);if(r.careDiscount)rows.push(['劍橋課輔減免',`${r.careTerms} 學期`]);if(r.fixedTerm&&v.chargeCareMaterials&&r.careTerms!==v.units)warnings.push(`課程為 ${v.units} 期，課輔教材只設定 ${r.careTerms} 學期，請核對收費次數。`);}
 if(v.snackMode==='monthly'&&r.c.type!=='camp')monthlyRow('點心',v.snackQuantity);else if(v.snackMode==='single'&&r.c.type!=='camp')rows.push(['點心',`${v.snackQuantity} 次（不換算月數）`]);
 if(v.transportMode==='monthly'&&v.school!=='新光')monthlyRow('交通',v.transportQuantity);else if(v.transportMode==='single')rows.push(['交通',`${v.transportQuantity} 次（不換算月數）`]);else if(v.school==='新光')rows.push(['交通','新光免費']);
 if(r.materials)rows.push(['課程教材',`${r.materialCount} ${r.c.matUnit||'次'}`]);
 if(r.c.type==='half'&&v.chargeMaterials&&v.units>r.materialCount*2)warnings.push(`課程涵蓋 ${v.units} 個半年，教材僅收 ${r.materialCount} 年；請確認是否已有年度教材費繳納。`);
 if(target===null&&(v.snackMode==='monthly'&&r.c.type!=='camp'||v.transportMode==='monthly'&&v.school!=='新光'))warnings.push('此方案無可直接換算的月數，請核對點心／交通月數是否符合本次實際期間。');
 return {target,basis,rows,warnings};
}
function renderPeriodReview(v,r){const result=checkPeriods(v,r),signature=JSON.stringify({v,rows:result.rows,warnings:result.warnings});if(signature!==periodSignature){$('periodConfirmed').checked=false;periodSignature=signature;}
 $('periodBasis').textContent=result.basis;$('periodRows').innerHTML=result.rows.map(([a,b])=>`<div class="line"><span>${escapeHTML(a)}</span><b>${escapeHTML(b)}</b></div>`).join('');$('periodWarnings').textContent=result.warnings.length?result.warnings.join(' '):'目前各項期間未發現不一致。';$('periodConfirmWrap').hidden=!result.warnings.length;$('alignPeriods').hidden=result.target===null||!result.warnings.length;return result;}
