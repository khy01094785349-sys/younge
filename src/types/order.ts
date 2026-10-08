export interface Order {
  id: string;
  createdAt: string;
  customerName: string;
  phone: string;
  address: string;
  detailAddress: string;
  deliveryNote: string;
  paymentMethod: 'bank' | 'card' | 'simple';
  productName: string;
  optionName: string;
  boxCount: number;
  pouchCount: number;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  status: '입금대기' | '결제완료' | '주문접수' | '배송준비' | '배송중' | '배송완료' | '주문취소';
  courier?: string;
  trackingNumber?: string;
}

export interface StoreSettings {
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  shopName: string;
  contactPhone: string;
}
