
const query = document.getElementById('search')             // 입력한 값을 가져온다. id = 'search'
const submitBtn = document.getElementById('submit')
const BASE_URL = 'http://localhost:5000/api/words'

function checkIfStringHasSpecialCharacter(str) {
    const re = /[`!@#$%^&*()_+\-=\[\]{};':"\\|.<>\/?~]/;
    return re.test(str);
}

 // 검색어가 숫자가 들어간 경우 검색이 안되도록 함
function checkIfStringHasNumbers(str){
    return /\d/.test(str);
}

// 영어 문자가 들어간 경우 검색이 안되도록 함
function checkIfStringHasLetters(str){
    return /[a-zA-Z]/.test(str);
}     

 // 버튼 활성화
 function enableSubmitBtn(state){
    submitBtn.disabled = state
}


// 서버 데이터 가져오기
function getData(baseUrl, query) {
    enableSubmitBtn(true)
    console.log("서버 접속중.....");

    //사용자 입력 유효성 검증
    if(checkIfStringHasSpecialCharacter(query)){
        enableSubmitBtn(false) // 활성화
        container.innerHTML = "Your search keyword has special character. Retype only hangle! !"
        return;
    }

    if(checkIfStringHasNumbers(query)){
        container.innerHTML = "Your search keyword has Numbers. Retype only hangle! !"
        return;
    }

     // if(checkIfStringHasLetters(query)){
     //     enableSubmitBtn(false) // 활성화
    //     container.innerHTML = "우리는 한국인입니다. 한글을 사랑하므로 한글 단어를 입력하세요!"
    //     return;
    //  }           

    fetch( `${baseUrl}/${query}`, {

        headers: {
            "Content-Type": "application/json",
            // "Access-Control-Allow-Origin": "*" // 이 코드 때문에 CORS 에러가 발생한것임. 이 코드 주석처리하면 프론트엔드에서 곧바로 외부 API 접근가능하다. (프록시나 서버가 필요없음)
        }
    })
    .then( res => res.json())
    .then( data => {

        enableSubmitBtn(false)      //활성화
        console.log(data)
        const {words} = data;

        // 데이터 유효성 검증
        if(words.length === 0) {
            container.innerHTML = "No Words Found!"
            return;
        }

        const template = words.map(word => {
           
            return (
                `
                <div class="item">
                <div class="word"><a href="${word.r_link}" target="_blank">${word.r_word}</a><sup>${word.r_seq ? word.r_seq : ""}</sup> ${word.r_chi} ${word.r_pos}</div>
                <p class ="description">${word.r_des}</p>
                </div>
                `
            )
        })
        container.innerHTML = template.join("") // DOM에 Template 삽입
    })
}

submitBtn.addEventListener('click', function() {
    console.log(query.value)            // 입력한 값
    getData(BASE_URL, query.value)      // 5초
})


query.addEventListener('keypress', function(e) {
    console.log('key pressd')
    if(e.keyCode === 13){            // Enter 키
        getData(BASE_URL, query.value)
    }
})
window.addEventListener('DOMContentLoaded', function() { 
    getData(BASE_URL)
})
