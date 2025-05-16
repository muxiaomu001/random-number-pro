// 函数：用于从 URL 获取指定参数的值
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// --- 脚本加载时立即执行的逻辑 ---
// 1. 尝试从 URL 参数 "display_numbers" 获取要直接显示的数字列表
const numbersToDisplayFromUrl = getQueryParam('display_numbers');
let preSetNumbers = null; // 用于存储从 'display_numbers' 解析的数字数组

if (numbersToDisplayFromUrl !== null && numbersToDisplayFromUrl !== "") {
    preSetNumbers = numbersToDisplayFromUrl.split(',')
        .map(numStr => numStr.trim()) // 去除每个数字字符串前后的空格
        .filter(numStr => numStr !== ""); // 过滤掉处理后可能产生的空字符串
    if (preSetNumbers.length > 0) {
        console.log('提示：已从URL参数 "display_numbers" 中读取到要直接显示的数字列表:', preSetNumbers);
    } else {
        preSetNumbers = null; // 如果解析后没有有效数字，则重置为null
        console.log('提示：URL参数 "display_numbers" 存在但未包含有效数字。');
    }
}

// 2. 如果 "display_numbers" 未提供，则尝试从 URL 参数 "mysecret" 获取固定种子 (用于固定随机序列)
let preCalculatedSeed = null; // 用于存储从 'mysecret' 计算得到的种子
if (preSetNumbers === null) { // 仅当没有直接指定数字时，才检查固定种子参数
    const initialSecretSeedParam = getQueryParam('mysecret');
    if (initialSecretSeedParam !== null && initialSecretSeedParam !== "") {
        let numericSeed = 0;
        for (let k = 0; k < initialSecretSeedParam.length; k++) {
            numericSeed += initialSecretSeedParam.charCodeAt(k);
        }
        preCalculatedSeed = numericSeed;
        console.log('提示：已从URL参数 "mysecret" 中读取到固定种子。');
    }
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
    if (preSetNumbers !== null) { // 注意这里检查的是 preSetNumbers 是否在加载时被有效赋值
        console.log("模式：直接显示来自URL 'display_numbers' 的数字。");
        let outputHtml = '';
        for (var i = 0; i < preSetNumbers.length; i++) {
            // preSetNumbers 中的元素已经是 trim 过的且非空
            outputHtml += (i === 0 ? '' : ' ') + '<b>' + preSetNumbers[i] + '</b>';
        }
        $('#randomNumbers').html(outputHtml);
        // （可选）如果您希望“生成数量”框也同步更新为人为指定的数字个数
        // $('#randomCount').val(preSetNumbers.length);
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

    if (randomCount < 1) {
        $('#randomNumbers').html('生成数量必须至少为 1。');
        return;
    }
    if (randomMinimum < 0) {
        $('#randomNumbers').html('最小数字不能小于 0。');
        return;
    }
     if (randomMaximum < 0) { // 允许最大数字为0，但必须大于等于最小数字
         $('#randomNumbers').html('最大数字不能小于 0。');
         return;
    }
    if (randomMaximum < randomMinimum) {
        $('#randomNumbers').html('最大数字必须大于或等于最小数字。');
        return;
    }
    if (typeSelectValue === 'unique' && randomCount > (randomMaximum - randomMinimum + 1)) {
        $('#randomNumbers').html('唯一序列模式下，生成数量不能超过（最大数字 - 最小数字 + 1）的总范围。');
        return;
    }

    let seedToUse;
    if (preCalculatedSeed !== null) { // 检查是否通过 'mysecret' URL 参数提供了固定种子
        seedToUse = preCalculatedSeed;
        console.log('提示：正在使用从URL "mysecret" 捕获的固定种子进行随机生成。');
    } else {
        seedToUse = new Date().getTime(); // 默认使用时间种子
        console.log('提示：使用时间种子进行随机生成。');
    }

    var mTwister = new MersenneTwister(seedToUse);
    var randomNumbersArray = [];
    var attempts = 0;
    var maxAttempts = randomCount * 200; // 稍微增加尝试次数的上限因子

    for (var i = 0; i < randomCount; i++) {
        if (attempts > maxAttempts && typeSelectValue === 'unique') {
            $('#randomNumbers').html('警告：尝试次数过多，可能无法在指定范围内生成足够的唯一随机数。请检查范围或数量。');
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

        if (found) {
            i--;
            attempts++;
        } else {
            randomNumbersArray.push(number);
            attempts = 0; // 成功找到一个不重复的就重置尝试次数
        }
    }

    let resultHtml = '';
    for (var k = 0; k < randomNumbersArray.length; k++) {
        resultHtml += (k === 0 ? '' : ' ') + '<b>' + randomNumbersArray[k] + '</b>';
    }
    $('#randomNumbers').html(resultHtml);
});