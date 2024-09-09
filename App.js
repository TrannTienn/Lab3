import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, TextInput, KeyboardAvoidingView, Platform, ScrollView, StatusBar, useWindowDimensions, Animated } from 'react-native';
import { Audio } from 'expo-av';

export default function App() {
  const [inputValue, setInputValue] = useState('');
  const { width, height } = useWindowDimensions();
  const [sound, setSound] = useState();
  const [notes, setNotes] = useState([]);

  const isPortrait = height > width;
  const imageHeight = isPortrait ? width * 0.75 : width * 0.4; 
  const buttonWidth = width / 2 - 20; 

  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync(); // Giải phóng âm thanh khi component bị hủy
      }
    };
  }, [sound]);

  const handlePress = async (note) => {
    const newNote = {
      id: Date.now().toString(),
      position: new Animated.Value(0),
      note: note,
    };

    setNotes((prevNotes) => [...prevNotes, newNote]);

    Animated.timing(newNote.position, {
      toValue: height,
      duration: 3000,
      useNativeDriver: false,
    }).start(() => {
      setNotes((prevNotes) => prevNotes.filter((n) => n.id !== newNote.id));
    });

    if (sound) {
      await sound.stopAsync();
      sound.unloadAsync();
    }

    let soundFile;
    if (note === '♪') {
      soundFile = require('./assets/TROIEMLAI.mp3');
    } else if (note === '♫') {
      soundFile = require('./assets/ĐLTTAD.mp3');
    }

    const { sound: newSound } = await Audio.Sound.createAsync(soundFile);
    setSound(newSound);
    await newSound.playAsync();
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.select({ ios: 100, android: 0 })}
    >
      <StatusBar barStyle={isPortrait ? 'dark-content' : 'light-content'} backgroundColor={isPortrait ? '#4682B4' : '#50C878'} />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        
        <Animated.Image
          source={require('./assets/dianhac.png')} // Thay đổi đường dẫn tới hình đĩa nhạc
          style={{
            width: width * 0.5, // Tùy chỉnh kích thước hình ảnh theo tỷ lệ chiều rộng của màn hình
            height: width * 0.5, // Đảm bảo chiều cao bằng chiều rộng để giữ tỷ lệ 1:1
            borderRadius: width * 0.25, // Bo góc để tạo hình tròn
            top: height * -0.01, // Điều chỉnh khoảng cách từ trên cùng của màn hình
            left: (width - width * 1) / 2, // Căn giữa theo chiều ngang
            zIndex: 2, // Đảm bảo hình đĩa nhạc nằm trên các phần tử khác
          
         
          }}
        />

        <Image
          source={require('./assets/tt.jpg')}
          style={{ width: imageHeight, height: imageHeight }}
        />

        <TextInput
          style={styles.input}
          placeholder="Nhập văn bản"
          value={inputValue}
          onChangeText={setInputValue}
          placeholderTextColor="#888"
        />

        <View style={[styles.buttonContainer, { flexDirection: isPortrait ? 'column' : 'row' }]}>
          <TouchableOpacity style={[styles.button, { width: buttonWidth }]} onPress={() => handlePress('♪')}>
            <Text style={styles.buttonText}>♪</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, { width: buttonWidth }]} onPress={() => handlePress('♫')}>
            <Text style={styles.buttonText}>♫</Text>
          </TouchableOpacity>
        </View>

        {notes.map((note) => (
          <Animated.View
            key={note.id}
            style={{
              position: 'absolute',
              top: note.position,
              left: Math.random() * (width - 50),
              zIndex: 1,
            }}
          >
            <Text style={styles.noteText}>{note.note}</Text>
          </Animated.View>
        ))}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#27403e',
    padding: Platform.select({ ios: 20, android: 10 }),
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    width: '92%',
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
    color: 'white',
    marginTop: 20,
  },
  buttonContainer: {},
  button: {
    backgroundColor: '#21A691',
    padding: 4,
    margin: 5,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 33,
    color: 'white',
    fontWeight: 'bold',
  },
  noteText: {
    fontSize: 70,
    color: 'white',
  },
});
