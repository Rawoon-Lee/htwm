import { StyleSheet, Text, View, Pressable, Dimensions } from "react-native"
import { SelectButton } from "../../components/PrimaryButton"
import { routine } from "../../api/routine"

let height = Dimensions.get('screen').height;
let width = Dimensions.get('screen').width;


function RoutineBox(props: any) {

    let sec = 0;
    for (let i = 0; i < props.routine.sets.length; i++) {
        sec += props.routine.sets[i].sec;
    }
    let min = sec / 60;
    sec = sec % 60;
    return (
        <View style={boxStyle(props.routine.color).container}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", marginHorizontal: 25, marginTop: 10 }}>
                <Text style={{ fontSize: 25 }}>
                    하체루틴
                    {/* {props.routine.name} */}
                </Text>
                <Text style={{ marginTop: 10, fontSize: 15 }}>
                    {min} 분 {sec} 초
                </Text>
                <View style={{ borderRadius: 18, }}>
                    <Pressable onPress={() => {
                        console.log("hello");

                    }}
                        android_ripple={{ color: "yellow" }}
                        style={{ paddingHorizontal: 5 }}>
                        <Text>
                            ...
                        </Text>
                    </Pressable>
                </View>

            </View>
            <View style={{ flexDirection: "row", justifyContent: "space-between", marginHorizontal: 20, }}>
                <Text style={{ marginTop: 20 }}>
                    {
                        props.routine.sets.map((cur: any, idx: number) => {
                            return (
                                cur.exercise_name + ", "
                            )
                        })
                    }
                </Text>
                <View style={{ marginRight: -20 }}>
                    <SelectButton children={"제거"} color={"white"} borderColor={"pink"} clickFunction={() => {
                        let body = {username : props.routine.username, name : props.routine.name}
                        routine
                            .routineDelete(body)
                            .then(result => {
                                console.log(result.data)
                            })
                            .catch(err => {
                                console.log(err)
                            })
                    }} />
                </View>

            </View>

        </View>
    )
}

export default RoutineBox

const styles = StyleSheet.create({
    container: {
    },
})

const boxStyle = (color: any) => StyleSheet.create({
    container: {
        backgroundColor: color,
        opacity: 0.8,
        borderRadius: 10,
        width: width * 9 / 10,
        height: height / 8.5,
        justifyContent: "space-between"
    }
})