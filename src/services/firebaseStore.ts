import {
  collection,
  doc,
  setDoc,
  getDocs,
  onSnapshot,
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../lib/firebase';
import type { FullOrder, DeliveryBoy, OrderStatus } from '../store/shop';

/**
 * Save new order to Firestore
 */
export async function saveOrderToFirestore(order: FullOrder): Promise<void> {
  if (!isFirebaseConfigured || !db) return;
  try {
    const orderRef = doc(db, 'orders', order.id);
    await setDoc(orderRef, {
      ...order,
      createdAtServer: serverTimestamp(),
    });
  } catch (err) {
    console.warn('Could not sync order to Firestore:', err);
  }
}

/**
 * Update order status in Firestore
 */
export async function updateOrderStatusInFirestore(
  orderId: string,
  status: OrderStatus,
  deliveryNotes?: string,
  deliveredAt?: number
): Promise<void> {
  if (!isFirebaseConfigured || !db) return;
  try {
    const orderRef = doc(db, 'orders', orderId);
    const payload: Record<string, unknown> = {
      status,
      updatedAtServer: serverTimestamp(),
    };
    if (deliveryNotes) payload.deliveryNotes = deliveryNotes;
    if (deliveredAt) payload.deliveredAt = deliveredAt;
    await updateDoc(orderRef, payload);
  } catch (err) {
    console.warn('Could not update order status in Firestore:', err);
  }
}

/**
 * Assign delivery boy to order in Firestore
 */
export async function assignDeliveryBoyInFirestore(
  orderId: string,
  deliveryBoyId: string
): Promise<void> {
  if (!isFirebaseConfigured || !db) return;
  try {
    const orderRef = doc(db, 'orders', orderId);
    await updateDoc(orderRef, {
      assignedDeliveryBoyId: deliveryBoyId,
      status: 'Shipped',
      updatedAtServer: serverTimestamp(),
    });
  } catch (err) {
    console.warn('Could not assign delivery boy in Firestore:', err);
  }
}

/**
 * Sync delivery boy duty status to Firestore
 */
export async function updateDeliveryBoyDutyInFirestore(
  boyId: string,
  status: 'on_duty' | 'offline' | 'available'
): Promise<void> {
  if (!isFirebaseConfigured || !db) return;
  try {
    const boyRef = doc(db, 'delivery_boys', boyId);
    await setDoc(boyRef, { status, updatedAt: serverTimestamp() }, { merge: true });
  } catch (err) {
    console.warn('Could not update delivery boy in Firestore:', err);
  }
}

/**
 * Listen for live orders from Firestore
 */
export function listenToFirestoreOrders(
  onOrdersUpdated: (orders: FullOrder[]) => void
): () => void {
  if (!isFirebaseConfigured || !db) return () => {};

  const colRef = collection(db, 'orders');
  return onSnapshot(
    colRef,
    (snapshot: { forEach: (cb: (d: { id: string; data: () => unknown }) => void) => void }) => {
      const orders: FullOrder[] = [];
      snapshot.forEach((d: { id: string; data: () => unknown }) => {
        const data = d.data() as FullOrder;
        orders.push({
          ...data,
          id: d.id,
        });
      });
      // Sort newest first
      orders.sort((a, b) => b.placedAt - a.placedAt);
      if (orders.length > 0) {
        onOrdersUpdated(orders);
      }
    },
    (err: unknown) => {
      console.warn('Firestore orders snapshot error:', err);
    }
  );
}

