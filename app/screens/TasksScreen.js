import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import {
    collection,
    deleteDoc,
    doc,
    onSnapshot,
    orderBy,
    query,
    updateDoc
} from 'firebase/firestore';
import { useEffect, useState } from 'react';
import {
    Alert,
    FlatList,
    SafeAreaView,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { auth, db } from '../../firebaseConfig';
import AddTaskModal from '../components/AddTaskModal'; // We will create this next
import styles from '../styles/TaskScreen.styles';

const TasksScreen = () => {
  const router = useRouter();
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('All'); // 'All', 'Pending', 'Completed'
  const [isModalVisible, setModalVisible] = useState(false);
  const [uid, setUid] = useState(null);

  // --- Fetch Tasks ---
  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      router.replace('/');
      return;
    }
    setUid(user.uid);

    const tasksRef = collection(db, 'users', user.uid, 'dailyTasks');
    const q = query(tasksRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedTasks = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setTasks(fetchedTasks);
    });

    return () => unsubscribe();
  }, []);

  // --- Task Actions ---
  const toggleTask = async (taskId, currentStatus) => {
    try {
      const taskRef = doc(db, 'users', uid, 'dailyTasks', taskId);
      await updateDoc(taskRef, { isCompleted: !currentStatus });
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const deleteTask = (taskId) => {
    Alert.alert(
      "Delete Task",
      "Are you sure you want to delete this task?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteDoc(doc(db, 'users', uid, 'dailyTasks', taskId));
            } catch (error) {
              console.error("Error deleting task:", error);
            }
          }
        }
      ]
    );
  };

  // --- Filtering Logic ---
  const filteredTasks = tasks.filter(task => {
    if (filter === 'Pending') return !task.isCompleted;
    if (filter === 'Completed') return task.isCompleted;
    return true;
  });

  // --- Render Item ---
  const renderTask = ({ item }) => {
    // Format Date: "Nov 23, 2025"
    const dueDate = item.dueDate ? new Date(item.dueDate.seconds * 1000).toLocaleDateString() : 'No Date';
    const isOverdue = item.dueDate && new Date() > new Date(item.dueDate.seconds * 1000) && !item.isCompleted;

    return (
      <View style={styles.taskCard}>
        <TouchableOpacity 
          style={styles.checkboxContainer} 
          onPress={() => toggleTask(item.id, item.isCompleted)}
        >
          <MaterialCommunityIcons 
            name={item.isCompleted ? "checkbox-marked-circle" : "checkbox-blank-circle-outline"} 
            size={28} 
            color={item.isCompleted ? "#4CAF50" : "#8A2BE2"} 
          />
        </TouchableOpacity>
        
        <View style={styles.taskInfo}>
          <Text style={[styles.taskTitle, item.isCompleted && styles.completedText]}>
            {item.title}
          </Text>
          <View style={styles.metaRow}>
            <MaterialCommunityIcons name="calendar-clock" size={14} color={isOverdue ? "#FF5252" : "#888"} />
            <Text style={[styles.dateText, isOverdue && styles.overdueText]}> {dueDate}</Text>
          </View>
        </View>

        <TouchableOpacity onPress={() => deleteTask(item.id)} style={styles.deleteButton}>
          <Ionicons name="trash-outline" size={20} color="#FF5252" />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Tasks</Text>
        <View style={{ width: 24 }} /> 
      </View>

      {/* Filter Tabs */}
      <View style={styles.tabsContainer}>
        {['All', 'Pending', 'Completed'].map((tab) => (
          <TouchableOpacity 
            key={tab} 
            style={[styles.tab, filter === tab && styles.activeTab]} 
            onPress={() => setFilter(tab)}
          >
            <Text style={[styles.tabText, filter === tab && styles.activeTabText]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Task List */}
      <FlatList
        data={filteredTasks}
        renderItem={renderTask}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="clipboard-check-outline" size={60} color="#ccc" />
            <Text style={styles.emptyText}>No tasks found</Text>
          </View>
        }
      />

      {/* Floating Add Button */}
      <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)}>
        <Ionicons name="add" size={30} color="#fff" />
      </TouchableOpacity>

      {/* Add Task Modal */}
      <AddTaskModal 
        visible={isModalVisible} 
        onClose={() => setModalVisible(false)} 
        userId={uid}
      />
    </SafeAreaView>
  );
};

export default TasksScreen;