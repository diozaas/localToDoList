import React, {useEffect, useState} from 'react';
import {
  FlatList,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import Icon from 'react-native-vector-icons/dist/FontAwesome5';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Todo = () => {
  const [todoList, setTodoList] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [indeks, setIndeks] = useState(-1);

  const addTodo = () => {
    if (editMode == true) {
      let newList = [...todoList];
      newList[indeks].value = newTodo;
      setTodoList(newList);
      setEditMode(false);
      setNewTodo('');
    } else {
      setTodoList([
        ...todoList,
        {key: todoList.length.toString(), value: newTodo, isComplete: false},
      ]);
      setNewTodo('');
    }
  };

  const deleteItem = index => {
    let newList = [...todoList];
    newList.splice(index, 1);
    setTodoList(newList);
  };

  const check = index => {
    let newList = [...todoList];
    newList[index].isComplete = !newList[index].isComplete;
    setTodoList(newList);
  };

  useEffect(() => {
    const saveTodoList = async () => {
      try {
        await AsyncStorage.setItem('todoList', JSON.stringify(todoList));
      } catch (error) {
        console.log(error);
      }
    };
    saveTodoList();
  }, [todoList]);

  useEffect(() => {
    const loadTodoList = async () => {
      try {
        const storedList = await AsyncStorage.getItem('todoList');
        if (storedList) {
          setTodoList(JSON.parse(storedList));
        }
      } catch (error) {
        console.log(error);
      }
    };
    loadTodoList();
  }, []);

  return (
    <View style={{flex: 1, backgroundColor: '#212121'}}>
      <StatusBar barStyle="light-content" backgroundColor="#272727" />
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#303030',
          paddingVertical: 15,
          elevation: 3,
          marginBottom: 10,
        }}>
        <Text style={{color: '#fafafa'}}>Todo List</Text>
      </View>

      <FlatList
        data={todoList}
        renderItem={({item, index}) => (
          <View
            style={{
              backgroundColor: '#303030',
              marginHorizontal: 20,
              borderRadius: 3,
              paddingVertical: 10,
              paddingHorizontal: 10,
              marginTop: 10,
              flexDirection: 'row',
            }}>
            <TouchableOpacity
              onPress={() => {
                setNewTodo(item.value), setEditMode(true), setIndeks(index);
              }}
              style={{flex: 1, justifyContent: 'center'}}>
              <Text style={{color: '#fafafa'}}>{item.value}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => check(index)}
              style={{justifyContent: 'center'}}>
              <Icon
                name={item.isComplete === true ? 'check-square' : 'square'}
                size={30}
                color="#fafafa"
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => deleteItem(index)}
              style={{
                justifyContent: 'center',
                marginLeft: 30,
              }}>
              <Icon name={'trash-alt'} size={30} color="#fafafa" />
            </TouchableOpacity>
          </View>
        )}
        keyExtractor={item => item.value}
      />

      <TextInput
        value={newTodo}
        onChangeText={text => setNewTodo(text)}
        style={{
          backgroundColor: '#303030',
          paddingHorizontal: 10,
          marginHorizontal: 20,
          color: '#ffffff',
          marginBottom: 20,
        }}
        placeholderTextColor={'#fafafa'}
        placeholder="Masukan todo baru"
      />
      <TouchableOpacity
        style={{
          height: 30,
          backgroundColor: '#303030',
          marginHorizontal: 20,
          marginBottom: 10,
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 3,
        }}
        onPress={addTodo}>
        <Text style={{color: '#fafafa'}}>Add Todo</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Todo;
