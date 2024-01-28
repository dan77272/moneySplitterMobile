import axios from 'axios';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

export default function HomeScreen({navigation}) {

  const [isFocused, setIsFocused] = useState(false)
  const [groupSize, setGroupSize] = useState(2)
  const [groupName, setGroupName] = useState('')

  function handleGroupSize(newValue){
    const newGroupSize = parseInt(newValue, 10)
    if(!isNaN(newGroupSize)){
      setGroupSize(newGroupSize)
    }
  }

  function decreaseSize(){
    setGroupSize(Math.max(2, groupSize - 1))
  }

  function increaseSize(){
    setGroupSize(Math.min(999, groupSize + 1))
  }

  function handleSubmit(){
    const data = {groupSize, groupName}
    console.log(data)
    axios.post('http://192.168.2.14:3000/api/groups', data).then(response => {
        if(response.data.group._id){
          navigation.navigate('UserPage', {groupSize: groupSize, groupName: groupName, id: response.data.group._id})
        }
      }).catch(error => {
      console.error('Error', error)
    })
  }

  async function navigateToLastSavedPage(){
    try {
      const lastScreen = await AsyncStorage.getItem('lastScreen');
      const jsonData = await AsyncStorage.getItem('lastSavedData');
      if (lastScreen && jsonData) {
          const data = JSON.parse(jsonData);
          navigation.navigate(lastScreen, data);
      }
  } catch (e) {
      console.log("Error navigating to the last saved page:", e);
  }
  }

  return (
    <KeyboardAwareScrollView
      style={{ flex: 1 }}
      resetScrollToCoords={{ x: 0, y: 0 }}
      contentContainerStyle={styles.container}
      scrollEnabled={true}
      extraScrollHeight={100} // You can adjust this value to control scrolling
      enableOnAndroid={true}
      enableAutomaticScroll={(Platform.OS === 'ios')}>
        <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.header}>split<Text style={styles.span}>E</Text>ase</Text>
        <Text style={styles.p}>Easily split group bills.</Text>
        <Text style={styles.p}>We show who needs to pay who and make settling group debts simple.</Text>
        <View style={styles.formContainer}>
          <Text style={styles.groupSizeText}>How many people are in your group?</Text>
          <View style={styles.formContainerSub}>
            <TouchableOpacity style={styles.button} onPress={decreaseSize}><Text style={styles.buttonText}>-</Text></TouchableOpacity>
            <TextInput style={styles.input} keyboardType='numeric' value={groupSize.toString()} onChangeText={handleGroupSize}></TextInput>
            <TouchableOpacity style={styles.button} onPress={increaseSize}><Text style={styles.buttonText}>+</Text></TouchableOpacity>
          </View>
          <Text style={styles.groupName}>Give your group a name!</Text>
          <TextInput style={isFocused ? styles.focused : styles.inputName} placeholder='Group Name' onFocus={() => setIsFocused(true)} onBlur={() => setIsFocused(false)} value={groupName} onChangeText={text => setGroupName(text)}></TextInput>
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}><Text style={styles.submitText}>GO!</Text></TouchableOpacity>
        </View>
        <TouchableOpacity style={{marginTop: 30, backgroundColor: '#666699', paddingHorizontal: 10, paddingVertical: 15, borderRadius: 5}} onPress={navigateToLastSavedPage}>
          <Text style={{fontSize: 15, color: 'white'}}>
            Go to Last Saved Page
          </Text>
        </TouchableOpacity>
        <StatusBar style="auto" />
      </ScrollView>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingTop: 40,
    paddingHorizontal: 10
  },
  header: {
    fontSize: 70,
    color: '#34495e',
    fontWeight: 600, 
  },
  span: {
    color: '#3498db',
    fontWeight: 600,
  },
  p: {
    color: '#3498db',
    textAlign: 'center',
    marginTop: 10,
    fontSize: 17
  },
  formContainer: {
    marginTop: 20,
    backgroundColor: '#ecf0f1',
    padding: 20,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  groupSizeText: {
    fontSize: 20,
  },
  formContainerSub: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginTop: 20
  },
  button: {
    backgroundColor: '#3498db',
    paddingTop: 15,
    paddingBottom: 15,
    paddingLeft: 20,
    paddingRight: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 30
  },
  input: {
    backgroundColor: 'white',
    width: 100,
    fontSize: 40,
    paddingLeft: 15
  },
  groupName: {
    marginTop: 30,
    fontSize: 18,
    marginBottom: 10
  },
  inputName: {
    width: 200,
    height: 30,
    backgroundColor: 'white',
    fontSize: 20,
    borderRadius: 2,
    paddingLeft: 15
  },
  focused: {
    width: 200,
    height: 30,
    backgroundColor: 'white',
    fontSize: 20,
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 2,
    paddingLeft: 15
  },
  submitButton: {
    backgroundColor: '#2ecc71',
    width: 230,
    height: 40,
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5
  },
  submitText: {
    color: 'white',
    fontSize: 20
  }
});
