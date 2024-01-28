import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, Platform } from 'react-native';
import HorizontalLine from './components/HorizontalLine';
import { G, Path, Svg } from 'react-native-svg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
let inputCounter = 0

export default function UserPage({route, navigation}) {

  const {groupSize, groupName, id} = route.params
  console.log(route.params)
  const [people, setPeople] = useState([{ name: '' }, { name: '' }]);
  const [members, setMembers] = useState([])
  const [payment, setPayment] = useState([]);
  const [reason, setReason] = useState([]);
  const [count, setCount] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const [transactions, setTransactions] = useState([])
  const [error, setError] = useState('')
  const [showSaved, setShowSaved] = useState(false)
  const [pageId, setPageId] = useState('')


  useEffect(() => {
    async function loadDataFromStorage() {
      try {
        const jsonData = await AsyncStorage.getItem('lastSavedData');
        if (jsonData != null) {
          const savedData = JSON.parse(jsonData);
          setPeople(savedData.people || []);
          setMembers(savedData.members || []);
          setPayment(savedData.payment || []);
          setReason(savedData.reason || [])
          setCount(savedData.count || [])
          // ... set other states with savedData
          setPageId(savedData.id || '');
          // ... handle other saved data as needed
        }
      } catch (e) {
        console.log("Error loading data from AsyncStorage:", e);
      }
    }
  
    if (route.params && route.params.groupSize && route.params.id) {
      // Initialize state from route.params
      setMembers(Array.from({ length: route.params.groupSize }, () => ({ additionalInputs: [] })));
      setPeople(Array.from({ length: route.params.groupSize }, () => ({ name: '' })));
      setPayment(Array.from({length: route.params.groupSize}, (_, index) => ({[`main-${index}`]: ''})));
    } else {
      // Fallback to loading data from AsyncStorage
      loadDataFromStorage();
    }
  }, [route.params]);

  function handlePaymentChange(memberIndex, inputKey, e) {
    const inputValue = e.nativeEvent.text;
    console.log(inputValue)
    setPayment(prevPayment => {
        const newPayment = [...prevPayment];
        const memberPayments = newPayment[memberIndex] || {};
        memberPayments[inputKey] = inputValue;
        newPayment[memberIndex] = memberPayments;
        return newPayment;
    });
    console.log(members)
    console.log(payment)
}

function handleNameChange(e, memberIndex){
  if(error) setError('')
  // Assuming 'event' is the standard event object and the text is in event.nativeEvent.text
  const textValue = e.nativeEvent.text;
  console.log(textValue); // This should be the string

  const updatedPeople = people.map((person, index) => 
      index === memberIndex ? {...person, name: textValue} : person
  );
  setPeople(updatedPeople);
}

function handleReasonChange(memberIndex, inputKey, e){
  const inputValue = e.nativeEvent.text
  setReason(prevReason => {
      const newReason = [...prevReason];
      const memberReasons = newReason[memberIndex] || {};
      memberReasons[inputKey] = inputValue;
      newReason[memberIndex] = memberReasons;
      return newReason;
  });
  console.log(reason)
  console.log(members)
}



  function createDivs(){
    return members.map((member, memberIndex) => (
      <View key={memberIndex} style={styles.membersDiv}>
        <TextInput placeholder='Name' style={styles.nameInput} value={people[memberIndex]?.name ?? ''} onChange={e => handleNameChange(e, memberIndex)}/>
        {!people[memberIndex].name && error ? <Text style={{color: 'red'}}>{error}</Text> : ''}
        <View style={styles.bottomInputs}>
          <TextInput placeholder='What?' style={styles.input} key={`reason-input-${memberIndex}`} value={reason[memberIndex]?.[`reason-${memberIndex}`] || ''} onChange={e => handleReasonChange(memberIndex, `reason-${memberIndex}`, e)}/>
          <TextInput placeholder='How much?' keyboardType='numeric' style={styles.input} key={`main-input-${memberIndex}`} value={payment[memberIndex]?.[`main-${memberIndex}`] || ''} onChange={e => handlePaymentChange(memberIndex, `main-${memberIndex}`, e)}/>
        </View>
        <View>
          {member.additionalInputs.map((input, inputIndex) => (
            <View key={input.id} style={styles.additionalInputsDiv}>
              <TextInput placeholder='What?' style={styles.input} value={reason[memberIndex]?.[input.id] || ''} onChange={e => handleReasonChange(memberIndex, input.id, e)}/>
              <TextInput placeholder='How much?' keyboardType='numeric' style={styles.input} value={payment[memberIndex]?.[input.id] || ''} onChange={e => handlePaymentChange(memberIndex, input.id, e)}/>
              <TouchableOpacity style={{marginLeft: -5}} onPress={() => deleteInput(input.id)}>
                <Svg width="23" height="23" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                  <Path strokeLinecap="round" strokeLinejoin="round" d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </Svg>
              </TouchableOpacity>
            </View>
          ))}
        </View>
        <TouchableOpacity style={styles.moreButton} onPress={() => addInput(memberIndex)}>
          <Svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <Path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </Svg>
          <Text style={{fontSize: 18}}>
            More
          </Text>
        </TouchableOpacity>
      </View>
    ))
  }

  const addInput = (memberIndex) => {
    if(count){
        inputCounter = count
    }
    const newId = `${memberIndex}-${inputCounter++}`;
    setMembers(members.map((member, index) => {
        if (index === memberIndex) {
            return {
                ...member,
                additionalInputs: [
                    ...member.additionalInputs,
                    { id: newId }
                ]
            };
        }
        return member;
    }));
    setCount(inputCounter)
};

function deleteInput(uniqueId) {
  console.log(uniqueId)
  // Update members state
  setMembers(prevMembers => {
      return prevMembers.map(member => ({
          ...member,
          additionalInputs: member.additionalInputs.filter(input => input.id !== uniqueId)
      }));
  });

  // Update payment state
  setPayment(prevPayment => {
      return prevPayment.map(paymentObj => {
          const newPaymentObj = { ...paymentObj };
          console.log({ ...newPaymentObj }); // Log a copy
          delete newPaymentObj[uniqueId];
          return newPaymentObj;
      });
  });

  setReason(prevReason => {
      return prevReason.map(reasonObj => {
          const newReasonObj = {...reasonObj}
          delete newReasonObj[uniqueId]
          return newReasonObj
      })
  })
  console.log(members)
  console.log(payment)
}

function calculate() {

  for(const p of people){
      if(p.name === ''){
          setError('Please enter a name.')
          return
      }
  }


  let count = 0
  const debtors = []
  const creditors = []
  const newTransactions = [];



  const totals = payment.map(p => {
      let total = 0;
      Object.values(p).forEach(value => {
          const num = parseFloat(value);
          if (!isNaN(num)) {
              total += num;
          }
      });
      return total;
  });
  console.log(totals)
  const newSet = new Set(totals)
  if(newSet.size === 1){
      newTransactions.push('No one owes anyone anything.')
      setTransactions(newTransactions)
      setShowResult(true)
      return
  }

  var mainTotal = 0
  totals.map(t => {
      mainTotal += t
  })
  const mainAverage = parseFloat((mainTotal / totals.length).toFixed(2))

  totals.forEach(total => {
      if(total > mainAverage){
          creditors.push({total: total, name: people[count].name})
      }else if(total < mainAverage){
          debtors.push({total: total, name: people[count].name})
      }
      count += 1
  })

  debtors.forEach(debtor => {
      creditors.forEach(creditor => {
          if(mainAverage - debtor.total !== 0 && creditor.total - mainAverage !== 0){
              let amount = Math.min(mainAverage - debtor.total, creditor.total - mainAverage)
              console.log(people)
              newTransactions.push(`${debtor.name} pays ${creditor.name} $${amount.toFixed(2)}`)
              debtor.total += amount
              creditor.total -= amount
          }
      })
  })
  setTransactions(newTransactions)
setShowResult(true)
}

async function save(){
  setCount(inputCounter)
  if(pageId){
    const data = {id, groupName, people, members, payment, reason, transactions, pageId, count}
    axios.put('http://192.168.2.14:3000/api/savePageData', data).then(response => {
        console.log('Data saved:', response.data);
    }).catch(error => {
        console.error('Error saving data:', error)
    })
    try{
      const jsonValue = JSON.stringify(data)
      await AsyncStorage.setItem('lastSavedData', jsonValue)
      await AsyncStorage.setItem('lastScreen', 'UserPage');
    }catch(e){
      console.log(e)
    }
  }else{
    const data = {id, groupName, people, members, payment, reason, transactions, count}
    console.log(data)
    axios.post('http://192.168.2.14:3000/api/savePageData', data).then(response => {
      console.log('Data saved:', response.data);
    }).catch(error => {
        console.error('Error saving data:', error)
    })
    try{
      const jsonValue = JSON.stringify(data)
      await AsyncStorage.setItem('lastSavedData', jsonValue)
      await AsyncStorage.setItem('lastScreen', 'UserPage');
    }catch(e){
      console.log(e)
    }
  }

  setShowSaved(true)

  try{
    const jsonValue = JSON.stringify(data)
    await AsyncStorage.setItem('lastSavedData', jsonValue)
    await AsyncStorage.setItem('lastScreen', 'UserPage');
  }catch(e){
    console.log(e)
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
      <Text style={styles.groupName}>{groupName}</Text>
      <HorizontalLine/>
      <View>
        <View style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10}}>
          {createDivs()}
        </View>
        <View style={{marginTop: 10, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
          <TouchableOpacity style={{backgroundColor: '#3498db', paddingVertical: 10, borderRadius: 6, paddingHorizontal: 20}} onPress={calculate}>
            <Text style={{color: 'white', fontSize: 20}}>
              Calculate
            </Text>
          </TouchableOpacity>
          {showResult && (
            transactions.map((t, key) => (
              <View key={key} style={{marginTop: 10}}>
                <Text style={{backgroundColor: '#d9f6e5', fontSize: 24, paddingHorizontal: 3, paddingVertical: 2, borderWidth: 2}}>{t}</Text>
              </View>
            ))
          )}
          {showResult && 
            <TouchableOpacity onPress={save}>
                      <Svg style={{marginTop: 20}} fill="#000000" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" 
                        width="50" height="50" viewBox="0 0 407.096 407.096" xmlSpace="preserve">
                            <G><G>
                                <Path d="M402.115,84.008L323.088,4.981C319.899,1.792,315.574,0,311.063,0H17.005C7.613,0,0,7.614,0,17.005v373.086
                                    c0,9.392,7.613,17.005,17.005,17.005h373.086c9.392,0,17.005-7.613,17.005-17.005V96.032
                                    C407.096,91.523,405.305,87.197,402.115,84.008z M300.664,163.567H67.129V38.862h233.535V163.567z"/>
                                <Path d="M214.051,148.16h43.08c3.131,0,5.668-2.538,5.668-5.669V59.584c0-3.13-2.537-5.668-5.668-5.668h-43.08
                                    c-3.131,0-5.668,2.538-5.668,5.668v82.907C208.383,145.622,210.92,148.16,214.051,148.16z"/>
                                </G>
                            </G>
                    </Svg>
            </TouchableOpacity>}
            {showSaved && <Text>Page is saved!</Text>}
        </View>
      </View>
    </ScrollView>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        paddingVertical: 40,
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
      groupName: {
        fontSize: 20
      },
      membersDiv: {
        backgroundColor: '#ecf0f1',
        padding: 10,
        width: 380,
        marginBottom: 10,
        marginTop: 10,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        gap: 5
      },
      nameInput: {
        backgroundColor: 'white',
        marginBottom: 2,
        borderWidth: 1,
        borderColor: '#bdc3c7',
        height: 40,
        width: 310,
        paddingLeft: 2,
        fontSize: 20
      },
      bottomInputs:{
        display: 'flex',
        flexDirection: 'row',
        gap: 10,
        alignItems: 'center',
        justifyContent: 'center',
      },
      input: {
        width: 150,
        backgroundColor: 'white',
        height: 40,
        borderWidth: 1,
        borderColor: '#bdc3c7',
        fontSize: 20
      },
      moreButton: {
        borderWidth: 2,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 2,
        backgroundColor: 'white',
        paddingBottom: 3,
        paddingTop: 3,
        margin: 'auto',
        width: 310
      },
      additionalInputsDiv: {
        display: 'flex',
        flexDirection: 'row',
        gap: 10,
        alignItems: 'center',
        marginLeft: 27,
        marginBottom: 5
      }
})  