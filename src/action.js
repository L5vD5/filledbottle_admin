//page
const convert = 'convert' ;
const convertP = 'convertP' ;
const convertC = 'convertC' ;
const convertS = 'convertS' ;
const convertM = 'convertM' ;


function clickConvertPage(e) {
    return {
        type : convert,
        payload : e
    }
}
function clickConvertPageP(e) {
    return {
        type : convertP,
        payload : e
    }
}
function clickConvertPageC(e) {
    return {
        type : convertC,
        payload : e
    }
}
function clickConvertPageS(e) {
    return {
        type : convertS,
        payload : e
    }
}
function clickConvertPageM(e) {
    return {
        type : convertM,
        payload : e
    }
}

//search
const search = 'search'


function searchKeyword(e) {
    return {
        type : search,
        payload : e
    }
}

const searchC = 'searchC'


function searchKeywordC(e) {
    return {
        type : searchC,
        payload : e
    }
}

const searchP = 'searchP'


function searchKeywordP(e) {
    return {
        type : searchP,
        payload : e
    }
}

const searchS = 'searchS'


function searchKeywordS(e) {
    return {
        type : searchS,
        payload : e
    }
}

const searchM = 'searchM'


function searchKeywordM(e) {
    return {
        type : searchM,
        payload : e
    }
}

//product
const category = 'category'

function checkCategoryId(e) {
    return {
        type : category,
        payload : e,
    }
}

const family = 'family'

function checkFamily(e) {
    return {
        type : family,
        payload : e,
    }
}

const familyS = 'familyS'

function checkFamilyS(e) {
    return {
        type : familyS,
        payload : e,
    }
}

const show = 'show'

function changeShow() {
    return {
        type : show
    }
}

const stateP = 'stateP'

function changeStateP(e) {
    return {
        type : stateP,
        payload: e
    }
}

//stock

const plant = 'plant'

function checkPlant(e) {
    return {
        type : plant,
        payload : e
    }
}

//order_export
const pagination = {
    convert,
    convertP,
    convertC,
    convertS,
    convertM,
}

const searchPage = {
    search,
    searchC,
    searchP,
    searchS,
    searchM,
}

const product = {
    category,
    family,
    show,
    stateP
}

const stock = {
    plant,
    familyS
}

const pageFunction = {
    clickConvertPage,
    clickConvertPageP,
    clickConvertPageC,
    clickConvertPageS,
    clickConvertPageM,
}

const searchFunction = {
    searchKeyword,
    searchKeywordC,
    searchKeywordP,
    searchKeywordS,
    searchKeywordM,
}

const productFunction = {
    checkCategoryId,
    checkFamily,
    changeShow,
    changeStateP,
}

const stockFunction = {
    checkPlant,
    checkFamilyS
}

export { pagination, searchPage, product, stock }
export { searchFunction, pageFunction, productFunction, stockFunction }