import axios from 'axios';

const PATH = "https://api.alquran.cloud/v1/"

export default {
    getSurahDetails(num, language){
        let url = `${PATH}surah/${num}${language ? '/' + language : ''}`

        return axios.get(url)
    },
}