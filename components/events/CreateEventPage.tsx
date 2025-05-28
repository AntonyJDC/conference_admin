import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    Keyboard,
    Image,
    TouchableWithoutFeedback,
    Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import { IEvent } from '../../types/event';
import { useEventStore } from 'store/eventStore';
import { uploadImageToFirebase } from 'services/uploadImageFirebase';

export const CreateEventScreen = () => {
    const navigation = useNavigation();
    const { createEvent } = useEventStore();
    const [form, setForm] = useState<IEvent>({
        id: '',
        title: '',
        description: '',
        date: '',
        startTime: '',
        endTime: '',
        location: '',
        imageUrl: '',
        capacity: 0,
        spotsLeft: 0,
        categories: [],
    });

    const handleChange = (field: keyof IEvent, value: string | number | string[]) => {
        setForm({ ...form, [field]: value });
    };

    const handleSave = async () => {
        Alert.alert('Confirmar', '¿Deseas crear este evento?', [
            { text: 'Cancelar', style: 'cancel' },
            {
                text: 'Crear',
                onPress: async () => {
                    try {
                        if (!form.title || !form.date || !form.startTime || !form.endTime || !form.location) {
                            Alert.alert('Error', 'Por favor completa todos los campos obligatorios.');
                            return;
                        }
                        if (form.startTime >= form.endTime) {
                            Alert.alert('Error', 'La hora de inicio debe ser anterior a la hora de fin.');
                            return;
                        }
                        if (form.date < new Date().toISOString().split('T')[0]) {
                            Alert.alert('Error', 'La fecha no puede ser anterior a la fecha actual.');
                            return;
                        }
                        if (form.startTime < '00:00' || form.startTime > '23:59') {
                            Alert.alert('Error', 'La hora de inicio debe estar entre 00:00 y 23:59.');
                            return;
                        }
                        if (form.endTime < '00:00' || form.endTime > '23:59') {
                            Alert.alert('Error', 'La hora de fin debe estar entre 00:00 y 23:59.');
                            return;
                        }

                        const payload = { ...form };
                        if (form.imageUrl && form.imageUrl.startsWith('file://')) {
                            const downloadUrl = await uploadImageToFirebase(form.imageUrl, form.id);
                            payload.imageUrl = downloadUrl;
                        }
                        if (!form.imageUrl) {
                            Alert.alert('Error', 'Por favor selecciona una imagen.');
                            return;
                        }
                        await createEvent(payload);
                        Alert.alert('Éxito', 'Evento creado correctamente');
                        navigation.goBack();
                    } catch (err) {
                        console.error(err);
                        Alert.alert('Error', 'No se pudo crear el evento.');
                    }
                },
            },
        ]);
    };

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={{ flex: 1, backgroundColor: 'white' }}>
                    <ScrollView contentContainerStyle={{ padding: 20 }} keyboardShouldPersistTaps="handled">
                        <Text style={styles.label}>Título</Text>
                        <TextInput style={styles.input} placeholder="Título" onChangeText={text => handleChange('title', text)} />

                        <Text style={styles.label}>Descripción</Text>
                        <TextInput
                            style={[styles.input, styles.multiline]}
                            placeholder="Descripción"
                            multiline
                            onChangeText={text => handleChange('description', text)}
                        />

                        <Text style={styles.label}>Fecha</Text>
                        <TextInput style={styles.input} placeholder="YYYY-MM-DD" onChangeText={text => handleChange('date', text)} />

                        <View style={styles.row}>
                            <View style={{ flex: 1, marginRight: 6 }}>
                                <Text style={styles.label}>Inicio</Text>
                                <TextInput style={styles.input} placeholder="Hora inicio" onChangeText={text => handleChange('startTime', text)} />
                            </View>
                            <View style={{ flex: 1, marginLeft: 6 }}>
                                <Text style={styles.label}>Fin</Text>
                                <TextInput style={styles.input} placeholder="Hora fin" onChangeText={text => handleChange('endTime', text)} />
                            </View>
                        </View>

                        <Text style={styles.label}>Ubicación</Text>
                        <TextInput style={styles.input} placeholder="Ubicación" onChangeText={text => handleChange('location', text)} />

                        <Text style={styles.label}>Categorías</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Separadas por coma"
                            onChangeText={text => handleChange('categories', text.split(',').map(c => c.trim()))}
                        />

                        <View style={styles.row}>
                            <View style={{ flex: 1, marginRight: 6 }}>
                                <Text style={styles.label}>Capacidad total:</Text>
                                <TextInput
                                    placeholder="Capacidad"
                                    placeholderTextColor="#6b7280"
                                    value={form.capacity?.toString() ?? ''}
                                    onChangeText={(text) => handleChange('capacity', text)}
                                    style={styles.input}
                                />
                            </View>
                            <View style={{ flex: 1, marginLeft: 6 }}>
                                <Text style={styles.label}>Cupos restantes:</Text>
                                <TextInput
                                    placeholder="Disponibles"
                                    placeholderTextColor="#6b7280"
                                    value={form.spotsLeft?.toString() ?? ''}
                                    onChangeText={(text) => handleChange('spotsLeft', text)}
                                    style={styles.input}
                                />
                            </View>
                        </View>
                        <Text style={styles.label}>Imagen:</Text>
                        <TouchableOpacity
                            onPress={async () => {
                                const result = await ImagePicker.launchImageLibraryAsync({
                                    mediaTypes: ImagePicker.MediaTypeOptions.Images,
                                    quality: 0.7,
                                });
                                if (!result.canceled && result.assets.length > 0) {
                                    handleChange('imageUrl', result.assets[0].uri);
                                }
                            }}
                            style={styles.imagePicker}
                        >
                            {form.imageUrl ? (
                                <Image source={{ uri: form.imageUrl }} style={styles.imagePreview} />
                            ) : (
                                <View style={[styles.imagePreview, { backgroundColor: '#e5e7eb' }]} />
                            )}
                            <View style={styles.overlayLayer}>
                                <Text style={styles.overlayText}>Click para cambiar</Text>
                            </View>
                        </TouchableOpacity>
                    </ScrollView>

                    <View style={styles.footer}>
                        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.cancelButton}>
                            <Text style={styles.cancelText}>Cancelar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
                            <Text style={styles.saveText}>Crear</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    label: { fontWeight: 'bold', fontSize: 15, marginBottom: 8 },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        padding: 12,
        marginBottom: 10,
        fontSize: 14,
        backgroundColor: '#f9fafb',
    },
    multiline: { textAlignVertical: 'top', minHeight: 80 },
    row: { flexDirection: 'row', justifyContent: 'space-between' },
    imagePicker: {
        height: 180,
        borderRadius: 10,
        marginBottom: 12,
        overflow: 'hidden',
        position: 'relative',
    },
    imagePreview: { width: '100%', height: '100%', resizeMode: 'cover' },
    overlayLayer: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    overlayText: { color: '#fff', fontWeight: '600', fontSize: 16 },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 16,
        borderTopWidth: 1,
        borderColor: '#e5e7eb',
        backgroundColor: '#fff',
    },
    cancelButton: {
        flex: 1,
        marginRight: 8,
        padding: 14,
        backgroundColor: '#e5e7eb',
        borderRadius: 10,
        alignItems: 'center',
    },
    cancelText: { color: '#374151', fontWeight: '600' },
    saveButton: {
        flex: 1,
        marginLeft: 8,
        padding: 14,
        backgroundColor: '#2563eb',
        borderRadius: 10,
        alignItems: 'center',
    },
    saveText: { color: 'white', fontWeight: '600' },
});
