import React, { useState, useEffect } from 'react';
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
    Dimensions,
    Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { IEvent } from '../../types/event';
import * as ImagePicker from 'expo-image-picker';
import { useEventStore } from 'store/eventStore';
import { uploadImageToFirebase } from 'services/uploadImageFirebase';

export const EditEventScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { event } = route.params as { event: IEvent };
    const { updateEvent } = useEventStore();
    const [form, setForm] = useState<IEvent>(event);
    const [original, setOriginal] = useState<IEvent>(event);

    useEffect(() => {
        setForm(event);
        setOriginal(event);
    }, [event]);

    const handleChange = (field: keyof IEvent, value: string | number | string[]) => {
        setForm({ ...form, [field]: value });
    };

    const isChanged = () => JSON.stringify(form) !== JSON.stringify(original);

    const handleSave = async () => {
        if (!isChanged()) {
            navigation.goBack();
            return;
        }

        Alert.alert('Confirmar', '¿Deseas guardar los cambios?', [
            { text: 'Cancelar', style: 'cancel' },
            {
                text: 'Guardar',
                onPress: async () => {
                    try {
                        if (!form.title || !form.description || !form.date || !form.startTime || !form.endTime || !form.location || !form.capacity || !form.spotsLeft) {
                            Alert.alert('Error', 'Por favor completa todos los campos obligatorios.');
                            return;
                        }
                        let updatedForm = { ...form };
                        if (form.imageUrl !== original.imageUrl && form.imageUrl.startsWith('file://')) {
                            const downloadUrl = await uploadImageToFirebase(form.imageUrl, form.id);
                            updatedForm.imageUrl = downloadUrl;
                        }

                        await updateEvent(updatedForm);
                        Alert.alert('Éxito', 'Evento actualizado correctamente');
                        navigation.goBack();
                    } catch (err) {
                        console.error('Error al guardar:', err);
                        Alert.alert('Error', 'No se pudo guardar el evento');
                    }
                },
            },
        ]);
    };


    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={styles.container}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={{ flex: 1 }}>
                    <ScrollView
                        contentContainerStyle={styles.scrollContent}
                        keyboardShouldPersistTaps="handled"
                        showsVerticalScrollIndicator={false}
                    >
                        <Text style={styles.title_label}>Título:</Text>
                        <TextInput
                            placeholder="Título"
                            placeholderTextColor="#6b7280"
                            value={form.title}
                            onChangeText={(text) => handleChange('title', text)}
                            style={styles.input}
                        />

                        <Text style={styles.title_label}>Descripción:</Text>
                        <TextInput
                            placeholder="Descripción"
                            placeholderTextColor="#6b7280"
                            value={form.description}
                            onChangeText={(text) => handleChange('description', text)}
                            style={[styles.input, styles.multiline]}
                            multiline
                        />

                        <Text style={styles.title_label}>Fecha:</Text>
                        <TextInput
                            placeholder="Fecha (YYYY-MM-DD)"
                            placeholderTextColor="#6b7280"
                            value={form.date}
                            onChangeText={(text) => handleChange('date', text)}
                            style={styles.input}
                        />

                        <View style={styles.row}>
                            <View style={{ flex: 1, marginRight: 6 }}>
                                <Text style={styles.title_label}>Hora inicio:</Text>
                                <TextInput
                                    placeholder="Hora inicio"
                                    placeholderTextColor="#6b7280"
                                    value={form.startTime}
                                    onChangeText={(text) => handleChange('startTime', text)}
                                    style={styles.input}
                                />
                            </View>
                            <View style={{ flex: 1, marginLeft: 6 }}>
                                <Text style={styles.title_label}>Hora fin:</Text>
                                <TextInput
                                    placeholder="Hora fin"
                                    placeholderTextColor="#6b7280"
                                    value={form.endTime}
                                    onChangeText={(text) => handleChange('endTime', text)}
                                    style={styles.input}
                                />
                            </View>
                        </View>

                        <Text style={styles.title_label}>Ubicación:</Text>
                        <TextInput
                            placeholder="Ubicación"
                            placeholderTextColor="#6b7280"
                            value={form.location}
                            onChangeText={(text) => handleChange('location', text)}
                            style={styles.input}
                        />

                        <Text style={styles.title_label}>Categorías:</Text>
                        <TextInput
                            placeholder="Categorías (separadas por coma)"
                            placeholderTextColor="#6b7280"
                            value={form.categories?.join(', ')}
                            onChangeText={(text) =>
                                handleChange('categories', text.split(',').map((c) => c.trim()))
                            }
                            style={styles.input}
                        />

                        <View style={styles.row}>
                            <View style={{ flex: 1, marginRight: 6 }}>
                                <Text style={styles.title_label}>Capacidad total:</Text>
                                <TextInput
                                    placeholder="Capacidad"
                                    placeholderTextColor="#6b7280"
                                    value={form.capacity?.toString() ?? ''}
                                    onChangeText={(text) => handleChange('capacity', text)}
                                    style={styles.input}
                                />
                            </View>
                            <View style={{ flex: 1, marginLeft: 6 }}>
                                <Text style={styles.title_label}>Cupos restantes:</Text>
                                <TextInput
                                    placeholder="Disponibles"
                                    placeholderTextColor="#6b7280"
                                    value={form.spotsLeft?.toString() ?? ''}
                                    onChangeText={(text) => handleChange('spotsLeft', text)}
                                    style={styles.input}
                                />
                            </View>
                        </View>

                        <Text style={styles.title_label}>Imagen:</Text>
                        <TouchableOpacity
                            onPress={async () => {
                                const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
                                if (!permissionResult.granted) {
                                    alert('Permiso denegado para acceder a la galería.');
                                    return;
                                }

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

                    {/* Botones fijos */}
                    <View style={styles.footer}>
                        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.cancelButton}>
                            <Text style={styles.cancelText}>Cancelar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={handleSave}
                            style={[styles.saveButton, !isChanged() && { opacity: 0.5 }]}
                            disabled={!isChanged()}
                        >
                            <Text style={styles.saveText}>Guardar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    scrollContent: { padding: 20, paddingBottom: 40 },
    title_label: { fontSize: 15, fontWeight: 'bold', marginBottom: 8 },
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
    cancelText: {
        color: '#374151',
        fontWeight: '600',
    },
    saveButton: {
        flex: 1,
        marginLeft: 8,
        padding: 14,
        backgroundColor: '#2563eb',
        borderRadius: 10,
        alignItems: 'center',
    },
    saveText: {
        color: 'white',
        fontWeight: '600',
    },
});
