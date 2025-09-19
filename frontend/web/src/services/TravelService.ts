// Enhanced Travel Service - Phase 2
import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  getDoc,
  query, 
  where, 
  orderBy,
  onSnapshot,
  serverTimestamp 
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../firebase-config/firebase';

// Types for enhanced travel planning
export interface TravelPlan {
  id?: string;
  userId: string;
  title: string;
  description: string;
  destination: string;
  startDate: string;
  endDate: string;
  budget: number;
  currency: string;
  status: 'draft' | 'planned' | 'confirmed' | 'completed' | 'cancelled';
  itinerary: DayPlan[];
  accommodations: Accommodation[];
  transportation: Transportation[];
  activities: Activity[];
  documents: TravelDocument[];
  photos: string[];
  createdAt: any;
  updatedAt: any;
}

export interface DayPlan {
  date: string;
  location: string;
  activities: string[];
  meals: string[];
  accommodation?: string;
  notes: string;
  budget: number;
}

export interface Accommodation {
  id: string;
  name: string;
  type: 'hotel' | 'hostel' | 'apartment' | 'resort' | 'camping';
  location: string;
  checkIn: string;
  checkOut: string;
  price: number;
  currency: string;
  bookingRef: string;
  amenities: string[];
  rating?: number;
  photos: string[];
}

export interface Transportation {
  id: string;
  type: 'flight' | 'train' | 'bus' | 'car' | 'boat';
  from: string;
  to: string;
  departure: string;
  arrival: string;
  price: number;
  currency: string;
  bookingRef: string;
  seatNumber?: string;
  gate?: string;
}

export interface Activity {
  id: string;
  name: string;
  type: 'sightseeing' | 'adventure' | 'cultural' | 'food' | 'shopping' | 'relaxation';
  location: string;
  date: string;
  time: string;
  duration: number; // in hours
  price: number;
  currency: string;
  bookingRef?: string;
  description: string;
  rating?: number;
  photos: string[];
}

export interface TravelDocument {
  id: string;
  type: 'passport' | 'visa' | 'insurance' | 'ticket' | 'booking' | 'other';
  name: string;
  fileUrl: string;
  expiryDate?: string;
  notes: string;
}

export interface TravelExpense {
  id: string;
  planId: string;
  category: 'accommodation' | 'transportation' | 'food' | 'activities' | 'shopping' | 'other';
  description: string;
  amount: number;
  currency: string;
  date: string;
  location: string;
  receiptUrl?: string;
}

class TravelService {
  // Travel Plans Management
  async createTravelPlan(plan: Omit<TravelPlan, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const docRef = await addDoc(collection(db, 'travelPlans'), {
      ...plan,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return docRef.id;
  }

  async updateTravelPlan(planId: string, updates: Partial<TravelPlan>): Promise<void> {
    const planRef = doc(db, 'travelPlans', planId);
    await updateDoc(planRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
  }

  async deleteTravelPlan(planId: string): Promise<void> {
    await deleteDoc(doc(db, 'travelPlans', planId));
  }

  async getTravelPlan(planId: string): Promise<TravelPlan | null> {
    const planDoc = await getDoc(doc(db, 'travelPlans', planId));
    return planDoc.exists() ? { id: planDoc.id, ...planDoc.data() } as TravelPlan : null;
  }

  async getUserTravelPlans(userId: string): Promise<TravelPlan[]> {
    const q = query(
      collection(db, 'travelPlans'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as TravelPlan[];
  }

  // Real-time updates for travel plans
  subscribeToTravelPlans(userId: string, callback: (plans: TravelPlan[]) => void) {
    const q = query(
      collection(db, 'travelPlans'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    return onSnapshot(q, (querySnapshot) => {
      const plans = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as TravelPlan[];
      callback(plans);
    });
  }

  // Expense Tracking
  async addExpense(expense: Omit<TravelExpense, 'id'>): Promise<string> {
    const docRef = await addDoc(collection(db, 'travelExpenses'), {
      ...expense,
      createdAt: serverTimestamp()
    });
    return docRef.id;
  }

  async getPlanExpenses(planId: string): Promise<TravelExpense[]> {
    const q = query(
      collection(db, 'travelExpenses'),
      where('planId', '==', planId),
      orderBy('date', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as TravelExpense[];
  }

  // File Upload for Documents and Photos
  async uploadTravelDocument(file: File, planId: string, documentType: string): Promise<string> {
    const fileName = `${planId}/${documentType}/${Date.now()}_${file.name}`;
    const storageRef = ref(storage, `travel-documents/${fileName}`);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  }

  async uploadTravelPhoto(file: File, planId: string): Promise<string> {
    const fileName = `${planId}/photos/${Date.now()}_${file.name}`;
    const storageRef = ref(storage, `travel-photos/${fileName}`);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  }

  async deleteFile(fileUrl: string): Promise<void> {
    const fileRef = ref(storage, fileUrl);
    await deleteObject(fileRef);
  }

  // Travel Recommendations (AI-powered)
  async getTravelRecommendations(destination: string, budget: number, duration: number): Promise<any[]> {
    // This would integrate with your FastAPI backend for AI recommendations
    try {
      const response = await fetch('http://localhost:8080/recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          destination,
          budget,
          duration,
          preferences: {
            accommodation: 'any',
            activities: 'mixed',
            transportation: 'efficient'
          }
        })
      });
      return await response.json();
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      return [];
    }
  }

  // Weather Integration
  async getWeatherForecast(location: string, dates: { start: string; end: string }): Promise<any> {
    // This would integrate with a weather API
    try {
      const response = await fetch(`/api/weather?location=${location}&start=${dates.start}&end=${dates.end}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching weather:', error);
      return null;
    }
  }

  // Currency Conversion
  async convertCurrency(amount: number, from: string, to: string): Promise<number> {
    try {
      const response = await fetch(`/api/currency?amount=${amount}&from=${from}&to=${to}`);
      const data = await response.json();
      return data.convertedAmount;
    } catch (error) {
      console.error('Error converting currency:', error);
      return amount; // Return original amount if conversion fails
    }
  }
}

export const travelService = new TravelService();
