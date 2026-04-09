import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

import { updateEmail } from "firebase/auth";
import { onValue, ref, update } from "firebase/database";
import { auth, database } from "./services/connectionFirebase";

import React, { useEffect, useState } from "react";
import {
    Alert,
    Dimensions,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { RootStackParamList } from "@/app/(tabs)/index";

const { width } = Dimensions.get("window");
type NavProp = StackNavigationProp<RootStackParamList>;

export default function EditProfileScreen() {
    const navigation = 
}