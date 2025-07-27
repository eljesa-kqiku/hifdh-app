import axios from 'axios';

const PATH = "https://api.alquran.cloud/v1"

export default {
    getSurahDetails(num, language){
        let url = `${PATH}/surah/${num}${language ? '/' + language : ''}`

        return axios.get(url)
    },

    getJuzDetails(num, language){
        let url = `${PATH}/juz/${num}${language ? '/' + language : ''}`

        return axios.get(url)
    },

    getHizbDetails(num, language){
        let url = `${PATH}/hizbQuarter/${num}${language ? '/' + language : ''}`

        return axios.get(url)
    },
}