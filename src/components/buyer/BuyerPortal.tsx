import React, { useState } from 'react';
import {
  Package,
  Clock,
  MapPin,
  Heart,
  MessageSquare,
  Shield,
  Truck,
  ExternalLink,
  ChevronRight,
  Download,
  CheckCircle2,
} from 'lucide-react';
import { Order, Product, CurrencyConfig, SupportTicket } from '../../types';
import { formatPrice } from '../../utils/ecommerceCalculations';

interface BuyerPortalProps {
  orders: Order[];
  wishlistProducts: Product[];
  activeCurrency: CurrencyConfig;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onRemoveWishlist: (productId: string) => void;
  tickets: SupportTicket[];
  onCreateTicket: (ticket: SupportTicket) => void;
}

export const BuyerPortal: React.FC<BuyerPortalProps> = ({
  orders,
  wishlistProducts,
  activeCurrency,
  onSelectProduct,
  onAddToCart,
  onRemoveWishlist,
  tickets,
  onCreateTicket,
}) => {
  const [activeTab, setActiveTab] = useState<'orders' | 'wishlist' | 'support' | 'addresses'>('orders');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(orders.length > 0 ? orders[0] : null);

  // New ticket state
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketCategory, setTicketCategory] = useState<SupportTicket['category']>('Order Issue');
  const [ticketMessage, setTicketMessage] = useState('');
  const [showNewTicketModal, setShowNewTicketModal] = useState(false);

  const handleCreateTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject.trim() || !ticketMessage.trim()) return;

    const newTicket: SupportTicket = {
      id: `tick-${Date.now()}`,
      ticketNumber: `TK-${Math.floor(100 + Math.random() * 900)}-VIP`,
      customerName: 'Marcus Sterling',
      customerEmail: 'dailyheavenco@gmail.com',
      subject: ticketSubject.trim(),
      category: ticketCategory,
      priority: 'medium',
      status: 'open',
      createdAt: new Date().toLocaleString(),
      messages: [
        {
          id: `m-${Date.now()}`,
          sender: 'customer',
          senderName: 'Marcus Sterling',
          text: ticketMessage.trim(),
          timestamp: new Date().toLocaleString(),
        },
      ],
    };

    onCreateTicket(newTicket);
    setTicketSubject('');
    setTicketMessage('');
    setShowNewTicketModal(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Buyer Welcome Header */}
      <div className="bg-[#14141B] rounded-2xl border border-[#C9A646]/30 p-6 shadow-xl mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#690D18] to-[#0B0B0D] border-2 border-[#C9A646] flex items-center justify-center text-[#E1C574] font-serif font-black text-xl shadow-lg">
            MS
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-serif font-black text-white">
                Marcus Sterling
              </h1>
              <span className="text-[10px] bg-[#690D18] text-[#E1C574] font-bold px-2 py-0.5 rounded border border-[#C9A646]/40 uppercase">
                VIP Patron
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-0.5">
              marcus.sterling@gmail.com • DH&amp;Co Concierge Active
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex flex-wrap gap-1.5 bg-[#0B0B0D] p-1.5 rounded-xl border border-white/10 text-xs">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
              activeTab === 'orders'
                ? 'bg-[#690D18] text-[#E1C574] shadow-md border border-[#C9A646]/40'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Orders ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('wishlist')}
            className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
              activeTab === 'wishlist'
                ? 'bg-[#690D18] text-[#E1C574] shadow-md border border-[#C9A646]/40'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Heart className="w-3.5 h-3.5" />
            <span>Wishlist ({wishlistProducts.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('support')}
            className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
              activeTab === 'support'
                ? 'bg-[#690D18] text-[#E1C574] shadow-md border border-[#C9A646]/40'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Support Tickets ({tickets.length})</span>
          </button>
        </div>
      </div>

      {/* TAB 1: Orders and Tracking Timeline */}
      {activeTab === 'orders' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Order list */}
          <div className="lg:col-span-5 space-y-3">
            <h3 className="text-xs font-bold text-[#E1C574] uppercase tracking-wider">
              Purchase Consignments
            </h3>

            {orders.length > 0 ? (
              orders.map(ord => (
                <div
                  key={ord.id}
                  onClick={() => setSelectedOrder(ord)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    selectedOrder?.id === ord.id
                      ? 'bg-[#181822] border-[#C9A646] shadow-md shadow-[#690D18]/15'
                      : 'bg-[#121217] border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex justify-between items-start text-xs mb-2">
                    <div>
                      <span className="font-bold text-white font-mono">{ord.orderNumber}</span>
                      <div className="text-[10px] text-gray-500">{new Date(ord.createdAt).toLocaleDateString()}</div>
                    </div>
                    <span className="text-[10px] bg-[#690D18]/40 text-[#E1C574] border border-[#C9A646]/30 px-2 py-0.5 rounded font-bold uppercase">
                      {ord.status.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <div className="text-xs text-gray-300">
                    {ord.items.length} item{ord.items.length > 1 ? 's' : ''} • Total: <strong className="text-[#E1C574]">{formatPrice(ord.total, activeCurrency)}</strong>
                  </div>

                  <div className="text-[11px] text-gray-500 mt-1 truncate">
                    Method: {ord.paymentMethod.replace(/_/g, ' ').toUpperCase()} • {ord.isSimulatedPayment ? 'Simulated Sandbox' : 'Live'}
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center bg-[#121217] rounded-xl border border-white/5 text-gray-400 text-xs">
                No orders placed yet.
              </div>
            )}
          </div>

          {/* Order Detail & Timeline Inspector */}
          <div className="lg:col-span-7">
            {selectedOrder ? (
              <div className="bg-[#14141C] rounded-2xl border border-white/10 p-6 space-y-6">
                <div className="flex flex-wrap items-center justify-between pb-4 border-b border-white/10 gap-2">
                  <div>
                    <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Consignment Inspector</span>
                    <h3 className="text-lg font-bold text-white font-mono">{selectedOrder.orderNumber}</h3>
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-gray-400">Total</span>
                    <div className="text-lg font-black text-[#E1C574]">
                      {formatPrice(selectedOrder.total, activeCurrency)}
                    </div>
                  </div>
                </div>

                {/* Items */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-gray-300 uppercase tracking-wider">Ordered Articles</h4>
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="flex gap-3 p-3 rounded-xl bg-[#0E0E12] border border-white/5 text-xs">
                      <img
                        src={item.productImage}
                        alt={item.productTitle}
                        className="w-14 h-14 rounded-lg object-cover border border-white/10"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-white truncate">{item.productTitle}</div>
                        {item.variantName && (
                          <div className="text-[10px] text-[#C9A646]">{item.variantName}</div>
                        )}
                        <div className="text-[10px] text-gray-400">
                          Qty: {item.quantity} • Unit: {formatPrice(item.unitPrice, activeCurrency)}
                        </div>
                        {item.trackingNumber && (
                          <div className="text-[10px] text-emerald-400 font-mono mt-0.5">
                            Tracking: {item.trackingNumber} ({item.carrier})
                          </div>
                        )}
                      </div>
                      <div className="font-bold text-[#E1C574]">
                        {formatPrice(item.totalPrice, activeCurrency)}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Tracking Milestones Timeline */}
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-bold text-[#E1C574] uppercase tracking-wider flex items-center gap-2">
                    <Truck className="w-4 h-4 text-[#C9A646]" />
                    <span>Real-Time Consignment Timeline</span>
                  </h4>

                  <div className="space-y-3 pl-2 border-l-2 border-[#C9A646]/30 ml-2">
                    {selectedOrder.timeline.map(event => (
                      <div key={event.id} className="relative pl-4 text-xs space-y-0.5">
                        <div className="absolute -left-[13px] top-1 w-2.5 h-2.5 rounded-full bg-[#E1C574] border-2 border-[#0B0B0D]" />
                        <div className="flex justify-between items-baseline">
                          <span className="font-bold text-white">{event.title}</span>
                          <span className="text-[10px] text-gray-500">{event.timestamp}</span>
                        </div>
                        <p className="text-[11px] text-gray-400">{event.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Delivery Address Snapshot */}
                <div className="p-3.5 rounded-xl bg-[#0E0E12] border border-white/5 text-xs text-gray-400 space-y-1">
                  <div className="font-bold text-white flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#C9A646]" />
                    <span>Shipping Destination Snapshot</span>
                  </div>
                  <div>Recipient: {selectedOrder.customerName} ({selectedOrder.customerPhone})</div>
                  <div>{selectedOrder.shippingAddress.street}, {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.country} {selectedOrder.shippingAddress.postalCode}</div>
                </div>
              </div>
            ) : (
              <div className="p-12 text-center bg-[#14141C] rounded-2xl border border-white/5 text-gray-400 text-xs">
                Select an order to inspect delivery timeline and tracking.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: Wishlist */}
      {activeTab === 'wishlist' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-base font-serif font-bold text-white">
              Curated Wishlist ({wishlistProducts.length})
            </h3>
          </div>

          {wishlistProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlistProducts.map(prod => (
                <div key={prod.id} className="bg-[#121217] rounded-xl border border-white/10 p-4 space-y-3">
                  <img
                    src={prod.images[0]}
                    alt={prod.title}
                    className="w-full h-44 object-cover rounded-lg"
                  />
                  <div>
                    <div className="text-[10px] text-[#C9A646] uppercase font-bold">{prod.brand}</div>
                    <h4 className="text-sm font-bold text-white line-clamp-1">{prod.title}</h4>
                    <div className="text-sm font-black text-[#E1C574] mt-1">
                      {formatPrice(prod.price, activeCurrency)}
                    </div>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => onAddToCart(prod)}
                      className="flex-1 py-2 rounded-lg bg-[#690D18] hover:bg-[#8C1422] text-[#E1C574] text-xs font-bold transition-colors"
                    >
                      Add to Bag
                    </button>
                    <button
                      onClick={() => onRemoveWishlist(prod.id)}
                      className="px-3 py-2 rounded-lg bg-[#1C1C24] hover:bg-rose-950 text-gray-400 hover:text-rose-400 text-xs transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-16 text-center bg-[#121217] rounded-xl border border-white/5 text-gray-400 text-xs space-y-2">
              <Heart className="w-8 h-8 mx-auto text-gray-600" />
              <p>No items in your wishlist.</p>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: Support Tickets */}
      {activeTab === 'support' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-base font-serif font-bold text-white">VIP Support Concierge</h3>
              <p className="text-xs text-gray-400">Direct assistance for inquiries, customs questions, or delivery requests.</p>
            </div>
            <button
              onClick={() => setShowNewTicketModal(true)}
              className="px-4 py-2 rounded-xl bg-[#690D18] hover:bg-[#8C1422] text-[#E1C574] text-xs font-bold border border-[#C9A646]/50 transition-colors"
            >
              + Open Ticket
            </button>
          </div>

          {/* New Ticket Form Modal */}
          {showNewTicketModal && (
            <form onSubmit={handleCreateTicketSubmit} className="bg-[#16161F] border border-[#C9A646]/40 rounded-xl p-5 space-y-3">
              <div className="text-sm font-bold text-white">Create New Concierge Ticket</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-gray-400 mb-1">Subject</label>
                  <input
                    type="text"
                    required
                    placeholder="Brief description of issue"
                    value={ticketSubject}
                    onChange={e => setTicketSubject(e.target.value)}
                    className="w-full bg-[#0E0E12] border border-white/10 rounded-lg p-2 text-white focus:outline-none focus:border-[#C9A646]"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 mb-1">Category</label>
                  <select
                    value={ticketCategory}
                    onChange={e => setTicketCategory(e.target.value as any)}
                    className="w-full bg-[#0E0E12] border border-white/10 rounded-lg p-2 text-white focus:outline-none focus:border-[#C9A646]"
                  >
                    <option value="Order Issue">Order Issue</option>
                    <option value="Payment">Payment</option>
                    <option value="Shipping & Tracking">Shipping &amp; Tracking</option>
                    <option value="Returns & Refunds">Returns &amp; Refunds</option>
                    <option value="General Inquiry">General Inquiry</option>
                  </select>
                </div>
              </div>
              <textarea
                required
                rows={3}
                placeholder="Detailed inquiry or request..."
                value={ticketMessage}
                onChange={e => setTicketMessage(e.target.value)}
                className="w-full bg-[#0E0E12] border border-white/10 rounded-lg p-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#C9A646]"
              />
              <div className="flex justify-end gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setShowNewTicketModal(false)}
                  className="px-3 py-1.5 rounded-lg text-gray-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-[#690D18] text-[#E1C574] font-bold"
                >
                  Submit to Concierge
                </button>
              </div>
            </form>
          )}

          {/* Ticket List */}
          <div className="space-y-3">
            {tickets.map(ticket => (
              <div key={ticket.id} className="p-4 rounded-xl bg-[#121217] border border-white/10 space-y-3">
                <div className="flex justify-between items-start text-xs">
                  <div>
                    <span className="font-mono text-[#E1C574] font-bold mr-2">{ticket.ticketNumber}</span>
                    <span className="font-bold text-white">{ticket.subject}</span>
                    <div className="text-[10px] text-gray-500">{ticket.category} • {ticket.createdAt}</div>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${
                    ticket.status === 'resolved'
                      ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                      : 'bg-amber-950 text-amber-300 border-amber-800'
                  }`}>
                    {ticket.status.replace('_', ' ')}
                  </span>
                </div>

                <div className="bg-[#0B0B0D] rounded-lg p-3 space-y-2 text-xs">
                  {ticket.messages.map(msg => (
                    <div key={msg.id} className="space-y-0.5">
                      <div className="flex justify-between text-[10px]">
                        <span className={msg.sender === 'support' ? 'text-[#E1C574] font-bold' : 'text-gray-300 font-bold'}>
                          {msg.senderName}
                        </span>
                        <span className="text-gray-500">{msg.timestamp}</span>
                      </div>
                      <p className="text-gray-300 text-[11px] leading-relaxed">{msg.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
