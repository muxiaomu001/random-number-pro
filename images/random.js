// 函数：用于从 URL 获取指定参数的值
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// --- 脚本加载时立即执行的逻辑 ---
let preSetNumbers = null; // 用于存储从 'display_numbers' 解析的数字数组
let preCalculatedSeed = null; // 用于存储从 'mysecret' 计算得到的种子
let paramsWereUsed = false; // 标记是否使用了URL参数来激活特殊模式

// 1. 尝试从 URL 参数 "display_numbers" 获取要直接显示的数字列表
const numbersToDisplayFromUrl = getQueryParam('display_numbers');
if (numbersToDisplayFromUrl !== null && numbersToDisplayFromUrl !== "") {
    const parsedNumbers = numbersToDisplayFromUrl.split(',')
        .map(numStr => numStr.trim())
        .filter(numStr => numStr !== "");
    if (parsedNumbers.length > 0) {
        preSetNumbers = parsedNumbers;
        paramsWereUsed = true; // 标记已使用参数
        console.log('提示：已从URL参数 "display_numbers" 中读取到要直接显示的数字列表:', preSetNumbers);
    } else {
        console.log('提示：URL参数 "display_numbers" 存在但未包含有效数字。');
    }
}

// 2. 如果 "display_numbers" 未提供或无效，则尝试从 URL 参数 "mysecret" 获取固定种子
if (preSetNumbers === null) {
    const initialSecretSeedParam = getQueryParam('mysecret');
    if (initialSecretSeedParam !== null && initialSecretSeedParam !== "") {
        let numericSeed = 0;
        for (let k = 0; k < initialSecretSeedParam.length; k++) {
            numericSeed += initialSecretSeedParam.charCodeAt(k);
        }
        preCalculatedSeed = numericSeed;
        paramsWereUsed = true; // 标记已使用参数
        console.log('提示：已从URL参数 "mysecret" 中读取到固定种子。');
    }
}

// 3. 如果使用了任何特殊URL参数，并且浏览器支持，则清理地址栏中的URL参数
if (paramsWereUsed && window.history && window.history.replaceState) {
    const cleanUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
    window.history.replaceState({ path: cleanUrl }, '', cleanUrl);
    console.log('提示：URL已更新，参数已从地址栏移除（不影响当前已加载的页面状态）。');
}
// --- 脚本加载时执行的逻辑结束 ---


// MersenneTwister 对象的定义代码 (保持不变)
var MersenneTwister=function(seed){if(seed==undefined){seed=new Date().getTime();}
this.N=624;this.M=397;this.MATRIX_A=0x9908b0df;this.UPPER_MASK=0x80000000;this.LOWER_MASK=0x7fffffff;this.mt=new Array(this.N);this.mti=this.N+1;this.init_genrand(seed);}
MersenneTwister.prototype.init_genrand=function(s){this.mt[0]=s>>>0;for(this.mti=1;this.mti<this.N;this.mti++){var s=this.mt[this.mti-1]^(this.mt[this.mti-1]>>>30);this.mt[this.mti]=(((((s&0xffff0000)>>>16)*1812433253)<<16)+(s&0x0000ffff)*1812433253)
+this.mti;this.mt[this.mti]>>>=0;}}
MersenneTwister.prototype.init_by_array=function(init_key,key_length){var i,j,k;this.init_genrand(19650218);i=1;j=0;k=(this.N>key_length?this.N:key_length);for(;k;k--){var s=this.mt[i-1]^(this.mt[i-1]>>>30)
this.mt[i]=(this.mt[i]^(((((s&0xffff0000)>>>16)*1664525)<<16)+((s&0x0000ffff)*1664525)))
+init_key[j]+j;this.mt[i]>>>=0;i++;j++;if(i>=this.N){this.mt[0]=this.mt[this.N-1];i=1;}
if(j>=key_length)j=0;}
for(k=this.N-1;k;k--){var s=this.mt[i-1]^(this.mt[i-1]>>>30);this.mt[i]=(this.mt[i]^(((((s&0xffff0000)>>>16)*1566083941)<<16)+(s&0x0000ffff)*1566083941))
-i;this.mt[i]>>>=0;i++;if(i>=this.N){this.mt[0]=this.mt[this.N-1];i=1;}}
this.mt[0]=0x80000000;}
MersenneTwister.prototype.genrand_int32=function(){var y;var mag01=new Array(0x0,this.MATRIX_A);if(this.mti>=this.N){var kk;if(this.mti==this.N+1)
this.init_genrand(5489);for(kk=0;kk<this.N-this.M;kk++){y=(this.mt[kk]&this.UPPER_MASK)|(this.mt[kk+1]&this.LOWER_MASK);this.mt[kk]=this.mt[kk+this.M]^(y>>>1)^mag01[y&0x1];}
for(;kk<this.N-1;kk++){y=(this.mt[kk]&this.UPPER_MASK)|(this.mt[kk+1]&this.LOWER_MASK);this.mt[kk]=this.mt[kk+(this.M-this.N)]^(y>>>1)^mag01[y&0x1];}
y=(this.mt[this.N-1]&this.UPPER_MASK)|(this.mt[0]&this.LOWER_MASK);this.mt[this.N-1]=this.mt[this.M-1]^(y>>>1)^mag01[y&0x1];this.mti=0;}
y=this.mt[this.mti++];y^=(y>>>11);y^=(y<<7)&0x9d2c5680;y^=(y<<15)&0xefc60000;y^=(y>>>18);return y>>>0;}
MersenneTwister.prototype.genrand_int31=function(){return(this.genrand_int32()>>>1);}
MersenneTwister.prototype.genrand_real1=function(){return this.genrand_int32()*(1.0/4294967295.0);}
MersenneTwister.prototype.random=function(){return this.genrand_int32()*(1.0/4294967296.0);}
MersenneTwister.prototype.genrand_real3=function(){return(this.genrand_int32()+0.5)*(1.0/4294967296.0);}
MersenneTwister.prototype.genrand_res53=function(){var a=this.genrand_int32()>>>5,b=this.genrand_int32()>>>6;return(a*67108864.0+b)*(1.0/9007199254740992.0);}

// --- 按钮点击事件处理 ---
$('#randomGenerate').click(function () {
    // 优先处理通过 URL 'display_numbers' 参数直接指定的数字
    if (preSetNumbers !== null) {
        console.log("模式：直接显示来自URL 'display_numbers' 的预存数字。");
        let outputHtml = '';
        for (var i = 0; i < preSetNumbers.length; i++) {
            outputHtml += (i === 0 ? '' : ' ') + '<b>' + preSetNumbers[i] + '</b>';
        }
        $('#randomNumbers').html(outputHtml);
        return; // 处理完毕，直接退出函数
    }

    // --- 如果没有 'display_numbers' 参数，则执行正常的随机数生成（可能带 'mysecret' 种子） ---
    const minimumInputValue = $('#randomMinimum').val();
    const maximumInputValue = $('#randomMaximum').val();
    const countInputValue = $('#randomCount').val();
    const typeSelectValue = $('#randomType').val();

    const isCountValid = /^\d+$/.test(countInputValue);
    const isMinimumValid = /^\d+$/.test(minimumInputValue);
    const isMaximumValid = /^\d+$/.test(maximumInputValue);

    if (!isCountValid || !isMinimumValid || !isMaximumValid) {
        $('#randomNumbers').html('输入错误：最小数字、最大数字和生成数量都必须是有效的非负整数。');
        return;
    }

    const randomCount = parseInt(countInputValue);
    const randomMinimum = parseInt(minimumInputValue);
    const randomMaximum = parseInt(maximumInputValue);

    // （此处省略了一些之前已有的详细错误检查，您可以根据需要保留或调整）
    if (randomCount < 1 || randomMinimum < 0 || randomMaximum < 0 || randomMaximum < randomMinimum ||
        (typeSelectValue === 'unique' && randomCount > (randomMaximum - randomMinimum + 1))) {
        // 根据具体条件显示更详细的错误信息，这里仅作概括
        if (randomCount < 1) { $('#randomNumbers').html('生成数量必须至少为 1。'); return; }
        if (randomMinimum < 0) { $('#randomNumbers').html('最小数字不能小于 0。'); return; }
        if (randomMaximum < 0) { $('#randomNumbers').html('最大数字不能小于 0。'); return; }
        if (randomMaximum < randomMinimum) { $('#randomNumbers').html('最大数字必须大于或等于最小数字。'); return; }
        if (typeSelectValue === 'unique' && randomCount > (randomMaximum - randomMinimum + 1)) {
             $('#randomNumbers').html('唯一序列模式下，生成数量不能超过（最大数字 - 最小数字 + 1）的总范围。'); return;
        }
        return;
    }

    let seedToUse;
    if (preCalculatedSeed !== null) {
        seedToUse = preCalculatedSeed;
        console.log('提示：正在使用从URL "mysecret" 捕获的固定种子进行随机生成。');
    } else {
        seedToUse = new Date().getTime();
        console.log('提示：使用时间种子进行随机生成。');
    }

    var mTwister = new MersenneTwister(seedToUse);
    var randomNumbersArray = [];
    var attempts = 0;
    var maxAttempts = randomCount * 200;

    for (var i = 0; i < randomCount; i++) {
        if (attempts > maxAttempts && typeSelectValue === 'unique') {
            $('#randomNumbers').html('警告：尝试次数过多，可能无法在指定范围内生成足够的唯一随机数。');
            return;
        }
        var number = (Math.round(mTwister.random() * (randomMaximum - randomMinimum)) + randomMinimum);
        var found = false;
        if (typeSelectValue === 'unique') {
            for (var j = 0; j < randomNumbersArray.length; j++) {
                if (randomNumbersArray[j] === number) {
                    found = true;
                    break;
                }
            }
        }
        if (found) { i--; attempts++; }
        else { randomNumbersArray.push(number); attempts = 0; }
    }

    let resultHtml = '';
    for (var k = 0; k < randomNumbersArray.length; k++) {
        resultHtml += (k === 0 ? '' : ' ') + '<b>' + randomNumbersArray[k] + '</b>';
    }
    $('#randomNumbers').html(resultHtml);
});