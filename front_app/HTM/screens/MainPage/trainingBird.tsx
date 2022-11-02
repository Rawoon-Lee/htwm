import React from "react"
import { View, Image, Text, Dimensions } from "react-native"
import { StyleSheet } from "react-native"
let height = Dimensions.get("screen").height
let width = Dimensions.get("screen").width

let lifeQuotes = [
    "\"먹을 때는 만원, 뺄 때는 백만 원\"",
    "\"오늘 걷지 않으면 내일은 뛰어야 한다\"",
    "\"뇌세포는 죽지만 비만 세포는 죽지 않는다\"",
    "\"먹는데 1분 빼는데 1시간\"",
    "\"몸매가 곧 패션이다\"",
    "\"다이어트엔 유통기한이 없다\"",
    "\"땀은 지방의 눈물이다\"",
    "\"체중조절은 최고의 자기 관리\"",
    "\"천천히 빠지는 살은 있어도 안 빠지는 살은 없다\"",
    "\"운동은 배신하지 않는다\"",
    "\"고통은 지나가지만 아름다움은 남는다\"",
    "\"아무것도 하지 않으면 변하는 건 없다\"",
    "\"오늘도 수고했어\"",
    "\"둑흔둑흔\"",
    "\"오늘 닭가슴살 존맛탱\"",
    "\"맛있게 먹으면 0칼로리\"",
    "\"먹어봤자 아는 그 맛이다\"",
    "\"아는 맛이라서 먹는 것이다\""
]
let RandomNumber = Math.floor(Math.random() * (lifeQuotes.length - 1)) ;

function TrainingBird() {

    return (
        <View style={{alignItems:"center"}}>
            <Image style={styles.image} source={require('./../../assets/htwm_logo.png')} />
            <View style={styles.textContainer}>
                <Text style={styles.state}>{lifeQuotes[RandomNumber]}</Text>
            </View>
        </View>
    )
}

let styles = StyleSheet.create({
    image: {
        width : width * 5 / 10,
        height : width * 5 / 10
    },
    state: {
        textAlign: "center",
        fontSize: 15,
    },
    textContainer: {
        alignItems: "center",
        backgroundColor: "#FFF3A9",
        borderRadius: 10,
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
})

export default TrainingBird