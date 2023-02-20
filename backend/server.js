/* required modules */
const axios = require('axios')
const express = require('express')
const fs = require("fs");
// var path = require('path')

/* API KEYs */
const YELP_API_KEY = ""
const GOOGLE_MAP_API_KEY = ""

/* Define Server */
const app = express();

/* Config Server: Routes */
// HomePage
app.get('/', (req, resp) => {
    // filePath = "static/html/index.html"
    // resp.sendFile(filePath,{root: path.join(__dirname)}, function (err) {
    //     if (err) {
    //         next(err);
    //     } else {
    //         console.log('Sent:', filePath);
    //     }
    // });
    resp.send('Hello Engine!');
});

// Get autocomplete text list API: /autocomplete?text=[text]
app.get('/autocomplete', async (req, resp) => {
    responseJson = await callYelpAutocompleteAPI(String(req.query.text))
    var autocompleteTextList = []
    if (responseJson != null){
        // extract autocomplete text from categories[i].title
        if ("categories" in responseJson && responseJson.categories.length>0){
            for(i=0;i<responseJson.categories.length;i++){
                if ("title" in responseJson.categories[i]){
                    item = responseJson.categories[i].title
                    if (item!=null && item!=undefined && item!=""){
                        autocompleteTextList.push(item)
                    }
                }
            }
        }
        // extract autocomplete text from terms[i].text
        if ("terms" in responseJson && responseJson.terms.length>0){
            for(i=0;i<responseJson.terms.length;i++){
                if ("text" in responseJson.terms[i]){
                    item = responseJson.terms[i].text
                    if (item!=null && item!=undefined && item!=""){
                        autocompleteTextList.push(item)
                    }
                }
            }
        }
    }

    if (autocompleteTextList.length == 0){
        autocompleteTextList = [""]
    }  

    // autocompleteTextList = ["abc","cba","baz"]

    resp.setHeader("Access-Control-Allow-Origin", "*")
    resp.send(JSON.stringify(autocompleteTextList));
});

// List businesses API: /businesses??keyword=[keyword]]&latitude=[latitude]&longitude=[longitude]&distance=[distance]&category=[category]
app.get('/businesses', async (req, resp) => {
    keyword = String(req.query.keyword)
    latitude = Number(req.query.latitude)
    longitude = Number(req.query.longitude)
    radius = Math.round(Number(req.query.distance) * 1609.34) // miles to meters
    category = String(req.query.category)
    if (category == "Default")
         category = "All"
    if (category == "Arts and Entertainment")
        category = "arts"
    if (category == "Health and Medical")
        category = "health"
    if (category == "Hotels and Travel")
        category = "hotelstravel"
    if (category == "Food")
        category = "food"
    if (category == "Professional Services")
        category = "professional"
    responseJson = await callYelpBusinessesAPI(keyword,latitude,longitude,radius,category)
    businessesList = []
    if (responseJson != null){
        if ("businesses" in responseJson && responseJson.businesses.length>0){
            for(i=0;i<responseJson.businesses.length;i++){
                item = responseJson.businesses[i]
                var business = {
                    index: -1,
                    id: "",
                    imageUrl: "",
                    name: "",
                    rating: -1,
                    distance: -1,
                }
                business.index = i+1
                if("id" in item && item.id != ""){
                    business.id = item.id
                }
                if("image_url" in item && item.image_url != ""){
                    business.imageUrl = item.image_url
                }
                if("name" in item && item.name != ""){
                    business.name = item.name
                }
                if("rating" in item && item.rating != ""){
                    business.rating = Math.floor(item.rating)
                }
                if("distance" in item && item.distance != ""){
                    business.distance = Math.floor(item.distance / 1609.34)
                }
                businessesList.push(business)
            }
        }
    }

    if (businessesList.length == 0){
        var business = {
            index: -1,
            id: "",
            imageUrl: "",
            name: "",
            rating: -1,
            distance: -1,
        }
        businessesList = [business]
    }

    // let rawdata = fs.readFileSync("./sampleData/businesses.json")
    // let businessesList = JSON.parse(rawdata)

    resp.setHeader("Access-Control-Allow-Origin", "*")
    resp.send(JSON.stringify(businessesList));
});

// Get business detail API: /businesses/{id}
app.get('/businesses/:id', async (req, resp) => {
    responseJson = await callYelpBusinessDetailAPI(req.params.id)
    businessDetail = {
        id: "",
        name: "",
        status: "",
        category: "",
        address: "",
        coordinates :{
            latitude: "0",
            longitude: "0"
        },
        phoneNumber: "",
        price: "",
        moreInfoLink: "",
        photoLinks: [],
        twitterLink: "",
        facebookLink: ""
    }
    if (responseJson != null){
        if("id" in responseJson && responseJson.id != ""){
            businessDetail.id = responseJson.id
        }
        // extract name from responseJson
        if("name" in responseJson && responseJson.name != ""){
            businessDetail.name = responseJson.name
        }
        // extract status from responseJson
        if ("hours" in responseJson && "is_open_now" in responseJson.hours[0]){
            if(responseJson.hours[0].is_open_now){
                businessDetail.status = "Open Now"
            }
            else{
                businessDetail.status = "Closed"
            }
        }
        // extract category from responseJson
        if("categories" in responseJson && responseJson.categories.length>0){
            for (i=0;i<responseJson.categories.length;i++){
                if(i==0){
                    businessDetail.category = responseJson.categories[i].title
                }
                else{
                    businessDetail.category += " | " + responseJson.categories[i].title
                }
            }
        }
        // extract address from responseJson
        if ("location" in responseJson && "display_address" in responseJson.location
            && responseJson.location.display_address.length >0){
            for (i=0;i<responseJson.location.display_address.length;i++){
                if(i==0){
                    businessDetail.address = responseJson.location.display_address[i]
                }
                else{
                    businessDetail.address += " " + responseJson.location.display_address[i]
                }
            }
        }
        // extract latitude and longitude from responseJson
        if ("coordinates" in responseJson
            && "latitude" in responseJson.coordinates && "longitude" in responseJson.coordinates
            && responseJson.coordinates.latitude !="" && responseJson.coordinates.longitude!=""){
            businessDetail.coordinates = {}
            businessDetail.coordinates.latitude = (responseJson.coordinates.latitude).toString()
            businessDetail.coordinates.longitude = (responseJson.coordinates.longitude).toString()
        }
        // extract phoneNumber from responseJson
        if("display_phone" in responseJson && responseJson.display_phone != ""){
            businessDetail.phoneNumber = responseJson.display_phone
        }
        // extract price from responseJson
        if("price" in responseJson && responseJson.price!=""){
            businessDetail.price = responseJson.price
        }
        // extract moreInfoLink from responseJson
        if("url" in responseJson && responseJson.url!=""){
            businessDetail.moreInfoLink = responseJson.url
        }
        // extract photoLinks from responseJson
        if("photos" in responseJson && responseJson.photos.length>0){
            businessDetail.photoLinks = []
            for(i=0;i<responseJson.photos.length;i++){
                businessDetail.photoLinks.push(responseJson.photos[i])
            }
        }
        // extract twitterLink and facebookLink from responseJson
        if("alias" in responseJson && responseJson.alias !=""
            && "name" in responseJson && responseJson.name != ""){
            nameInUrl = String(responseJson.name).replaceAll(" ","%20")
            //businessDetail.twitterLink = `https://twitter.com/intent/tweet?url=https://www.yelp.com/biz/${responseJson.alias}?utm_campaign=www_business_share_popup&utm_medium=social&utm_source=twitter.com&text=Check%20${nameInUrl}%20on%20Yelp.`
            businessDetail.twitterLink = `https://twitter.com/intent/tweet?url=https://www.yelp.com/biz/${responseJson.alias}?adjust_creative=vroosL5uGpMpWJ6xp2BguQ&utm_medium=social&utm_source=twitter.com&text=Check%20${nameInUrl}%20on%20Yelp%2E`
            businessDetail.facebookLink = `https://www.facebook.com/sharer/sharer.php?u=https://www.yelp.com/biz/${responseJson.alias}?utm_campaign=www_business_share_popup&utm_medium=social&utm_source=facebook.com`
        }
    }
    resp.setHeader("Access-Control-Allow-Origin", "*")
    resp.send(JSON.stringify(businessDetail));
});

// Get business reviews API: /businesses/{id}/reviews
app.get('/businesses/:id/reviews', async (req, resp) => {
    responseJson = await callYelpBusinessReviewsAPI(req.params.id)
    reviewList = []
    if (responseJson != null){
        if ("reviews" in responseJson && responseJson.reviews.length>0){
            for(i=0;i<responseJson.reviews.length;i++){
                item = responseJson.reviews[i]
                review = {}
                if ("rating" in item && item.rating!=""){
                    review.rating = item.rating
                }
                if ("text" in item && item.text!=""){
                    review.text = item.text
                }
                if ("time_created" in item && item.time_created!=""){
                    review.time_created = item.time_created.split(" ")[0]
                }
                if ("user" in item && "name" in item.user && item.user.name!=""){
                    review.username = item.user.name
                }
                reviewList.push(review)
            }
        }
    }
    resp.setHeader("Access-Control-Allow-Origin", "*")
    resp.send(JSON.stringify(reviewList));
});

// Get address' geocode API: /geocode?address=[address]
app.get('/geocode', async (req, resp) => {
    responseJson = await callGoogleMapAPI(String(req.query.address))
    geoInfo = {
        latitude: "0",
        longitude: "0"
    }
    if (responseJson != null){
        if (responseJson.results.length>0){
            item =  responseJson.results[0]
            if ("geometry" in item && "location" in item.geometry
                && "lat" in item.geometry.location && "lng" in item.geometry.location
                && item.geometry.location.lat!="" && item.geometry.location.lng!="")
            geoInfo.latitude = (item.geometry.location.lat).toString()
            geoInfo.longitude = (item.geometry.location.lng).toString()
        }
    }
    resp.setHeader("Access-Control-Allow-Origin", "*")
    resp.send(JSON.stringify(geoInfo));
});

/* API calls to other servers */
async function callYelpAutocompleteAPI(currentText){
    try {
        var url = `https://api.yelp.com/v3/autocomplete?text=${currentText}`
        var config = {headers: {'Authorization': `Bearer ${YELP_API_KEY}`},}
        let resp = await axios.get(url,config)
        console.log(resp.data)
        return resp.data
    } catch (error) {
        console.error(error)
        return null
    }
}

async function callYelpBusinessesAPI(keyword,latitude,longitude,radius,category){
    try {
        var url = "https://api.yelp.com/v3/businesses/search"
        var config = {
            headers: {'Authorization': `Bearer ${YELP_API_KEY}`},
            params: {
                "term": keyword, 
                "latitude": latitude,
                "longitude": longitude,
                "radius": radius,
                "categories": category,
                "limit":10
                },
        }
        let resp = await axios.get(url,config)
        console.log(resp.data)
        return resp.data
    } catch (error) {
        console.error(error)
        return null
    }
}

async function callYelpBusinessDetailAPI(id){
    try {
        url = `https://api.yelp.com/v3/businesses/${id}`
        var config = {headers: {'Authorization': `Bearer ${YELP_API_KEY}`},}
        let resp = await axios.get(url,config)
        console.log(resp.data)
        return resp.data
    } catch (error) {
        console.error(error)
        return null
    }
}

async function callYelpBusinessReviewsAPI(id){
    try {
        url = `https://api.yelp.com/v3/businesses/${id}/reviews`
        var config = {headers: {'Authorization': `Bearer ${YELP_API_KEY}`},}
        let resp = await axios.get(url,config)
        console.log(resp.data)
        return resp.data
    } catch (error) {
        console.error(error)
        return null
    }
}

async function callGoogleMapAPI(address){
    try {
        url = `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${GOOGLE_MAP_API_KEY}`
        let resp = await axios.get(url)
        console.log(resp.data)
        return resp.data
    } catch (error) {
        console.error(error)
        return null
    }
}

/*Run Server*/
const PORT = process.env.PORT || 8080;
app.listen(PORT,() => {
    console.log(`Server listening on port ${PORT}...`);
});