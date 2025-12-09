import os
from flask import Flask, request, jsonify, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import text
from datetime import datetime, date
import time

basedir = os.path.abspath(os.path.dirname(__file__))
static_folder_path = os.path.join(basedir, 'dist', 'public')

app = Flask(__name__, static_folder=static_folder_path, static_url_path='')

database_url = os.environ.get('DATABASE_URL')
if database_url and database_url.startswith('postgres://'):
    database_url = database_url.replace('postgres://', 'postgresql://', 1)

app.config['SQLALCHEMY_DATABASE_URI'] = database_url
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = os.environ.get('SESSION_SECRET', 'prod-secret-key')

db = SQLAlchemy(app)

class Client(db.Model):
    __tablename__ = 'clients'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.Text, nullable=False)
    contact = db.Column(db.Text)
    email = db.Column(db.Text)
    phone = db.Column(db.Text)
    address = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Supplier(db.Model):
    __tablename__ = 'suppliers'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.Text, nullable=False)
    contact = db.Column(db.Text)
    email = db.Column(db.Text)
    phone = db.Column(db.Text)
    category = db.Column(db.Text)
    status = db.Column(db.Text, default='Ativo')
    rating = db.Column(db.Integer, default=5)
    production_time_days = db.Column(db.Integer, default=7)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Product(db.Model):
    __tablename__ = 'products'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.Text, nullable=False)
    sku = db.Column(db.Text, nullable=False, unique=True)
    category = db.Column(db.Text)
    price = db.Column(db.Numeric(10, 2), nullable=False)
    cost = db.Column(db.Numeric(10, 2), nullable=False)
    stock = db.Column(db.Integer, default=0)
    colors = db.Column(db.JSON)
    sizes = db.Column(db.JSON)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Print(db.Model):
    __tablename__ = 'prints'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.Text, nullable=False)
    technique = db.Column(db.Text)
    colors = db.Column(db.Text)
    image_url = db.Column(db.Text)
    image_type = db.Column(db.Text, default='url')
    tags = db.Column(db.JSON)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Quote(db.Model):
    __tablename__ = 'quotes'
    id = db.Column(db.Integer, primary_key=True)
    quote_number = db.Column(db.Text, nullable=False, unique=True)
    client_id = db.Column(db.Integer, db.ForeignKey('clients.id'))
    lead_name = db.Column(db.Text)
    lead_contact = db.Column(db.Text)
    items_summary = db.Column(db.Text)
    total_value = db.Column(db.Numeric(10, 2), nullable=False)
    status = db.Column(db.Text, default='Rascunho')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    client = db.relationship('Client', backref='quotes')

class Order(db.Model):
    __tablename__ = 'orders'
    id = db.Column(db.Integer, primary_key=True)
    order_number = db.Column(db.Text, nullable=False, unique=True)
    quote_id = db.Column(db.Integer, db.ForeignKey('quotes.id'))
    client_id = db.Column(db.Integer, db.ForeignKey('clients.id'), nullable=False)
    items_summary = db.Column(db.Text)
    total_value = db.Column(db.Numeric(10, 2), nullable=False)
    delivery_date = db.Column(db.Date)
    stage = db.Column(db.Text, default='Aguardando')
    progress = db.Column(db.Integer, default=0)
    priority = db.Column(db.Text, default='Normal')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    client = db.relationship('Client', backref='orders')

class Transaction(db.Model):
    __tablename__ = 'transactions'
    id = db.Column(db.Integer, primary_key=True)
    transaction_number = db.Column(db.Text, nullable=False, unique=True)
    order_id = db.Column(db.Integer, db.ForeignKey('orders.id'))
    description = db.Column(db.Text, nullable=False)
    category = db.Column(db.Text)
    type = db.Column(db.Text, nullable=False)
    amount = db.Column(db.Numeric(10, 2), nullable=False)
    status = db.Column(db.Text, default='Pendente')
    transaction_date = db.Column(db.Date, default=date.today)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

with app.app_context():
    db.create_all()

@app.route('/api/health')
def health():
    return jsonify({'status': 'ok'})

@app.route('/api/clients', methods=['GET'])
def get_clients():
    try:
        clients = Client.query.all()
        return jsonify([{
            'id': c.id,
            'name': c.name,
            'contact': c.contact,
            'email': c.email,
            'phone': c.phone,
            'address': c.address,
            'createdAt': c.created_at.isoformat() if c.created_at else None
        } for c in clients])
    except Exception as e:
        print(f"Error fetching clients: {e}")
        return jsonify({'error': 'Failed to fetch clients'}), 500

@app.route('/api/clients', methods=['POST'])
def create_client():
    try:
        data = request.json
        client = Client(
            name=data.get('name'),
            contact=data.get('contact'),
            email=data.get('email'),
            phone=data.get('phone'),
            address=data.get('address')
        )
        db.session.add(client)
        db.session.commit()
        return jsonify({'id': client.id, 'message': 'Cliente criado com sucesso'}), 201
    except Exception as e:
        print(f"Error creating client: {e}")
        db.session.rollback()
        return jsonify({'error': 'Failed to create client'}), 500

@app.route('/api/suppliers', methods=['GET'])
def get_suppliers():
    try:
        suppliers = Supplier.query.all()
        return jsonify([{
            'id': s.id,
            'name': s.name,
            'contact': s.contact,
            'email': s.email,
            'phone': s.phone,
            'category': s.category,
            'status': s.status,
            'rating': s.rating,
            'productionTimeDays': s.production_time_days
        } for s in suppliers])
    except Exception as e:
        print(f"Error fetching suppliers: {e}")
        return jsonify({'error': 'Failed to fetch suppliers'}), 500

@app.route('/api/suppliers', methods=['POST'])
def create_supplier():
    try:
        data = request.json
        supplier = Supplier(
            name=data.get('name'),
            contact=data.get('contact'),
            email=data.get('email'),
            phone=data.get('phone'),
            category=data.get('category'),
            status=data.get('status', 'Ativo'),
            rating=data.get('rating', 5),
            production_time_days=data.get('productionTimeDays', 7)
        )
        db.session.add(supplier)
        db.session.commit()
        return jsonify({'id': supplier.id, 'message': 'Fornecedor criado com sucesso'}), 201
    except Exception as e:
        print(f"Error creating supplier: {e}")
        db.session.rollback()
        return jsonify({'error': 'Failed to create supplier'}), 500

@app.route('/api/products', methods=['GET'])
def get_products():
    try:
        products = Product.query.all()
        return jsonify([{
            'id': p.id,
            'name': p.name,
            'sku': p.sku,
            'category': p.category,
            'price': float(p.price) if p.price else 0,
            'cost': float(p.cost) if p.cost else 0,
            'stock': p.stock,
            'colors': p.colors,
            'sizes': p.sizes
        } for p in products])
    except Exception as e:
        print(f"Error fetching products: {e}")
        return jsonify({'error': 'Failed to fetch products'}), 500

@app.route('/api/products', methods=['POST'])
def create_product():
    try:
        data = request.json
        product = Product(
            name=data.get('name'),
            sku=data.get('sku'),
            category=data.get('category'),
            price=data.get('price'),
            cost=data.get('cost'),
            stock=data.get('stock', 0),
            colors=data.get('colors'),
            sizes=data.get('sizes')
        )
        db.session.add(product)
        db.session.commit()
        return jsonify({'id': product.id, 'message': 'Produto criado com sucesso'}), 201
    except Exception as e:
        print(f"Error creating product: {e}")
        db.session.rollback()
        return jsonify({'error': 'Failed to create product'}), 500

@app.route('/api/prints', methods=['GET'])
def get_prints():
    try:
        prints = Print.query.all()
        return jsonify([{
            'id': p.id,
            'name': p.name,
            'technique': p.technique,
            'colors': p.colors,
            'imageUrl': p.image_url,
            'imageType': p.image_type,
            'tags': p.tags
        } for p in prints])
    except Exception as e:
        print(f"Error fetching prints: {e}")
        return jsonify({'error': 'Failed to fetch prints'}), 500

@app.route('/api/prints', methods=['POST'])
def create_print():
    try:
        data = request.json
        print_item = Print(
            name=data.get('name'),
            technique=data.get('technique'),
            colors=data.get('colors'),
            image_url=data.get('imageUrl'),
            image_type=data.get('imageType', 'url'),
            tags=data.get('tags')
        )
        db.session.add(print_item)
        db.session.commit()
        return jsonify({'id': print_item.id, 'message': 'Estampa criada com sucesso'}), 201
    except Exception as e:
        print(f"Error creating print: {e}")
        db.session.rollback()
        return jsonify({'error': 'Failed to create print'}), 500

@app.route('/api/prints/upload', methods=['POST'])
def upload_print():
    try:
        timestamp = int(time.time() * 1000)
        placeholder_url = f'/uploads/print_{timestamp}.png'
        return jsonify({'url': placeholder_url})
    except Exception as e:
        print(f"Error uploading print: {e}")
        return jsonify({'error': 'Failed to upload print'}), 500

@app.route('/api/quotes', methods=['GET'])
def get_quotes():
    try:
        quotes = Quote.query.all()
        result = []
        for q in quotes:
            client_name = q.client.name if q.client else q.lead_name
            contact = q.client.contact if q.client else q.lead_contact
            result.append({
                'id': q.id,
                'quoteNumber': q.quote_number,
                'clientId': q.client_id,
                'clientName': client_name,
                'contact': contact,
                'itemsSummary': q.items_summary,
                'totalValue': float(q.total_value) if q.total_value else 0,
                'status': q.status,
                'date': q.created_at.strftime('%d/%m/%Y') if q.created_at else ''
            })
        return jsonify(result)
    except Exception as e:
        print(f"Error fetching quotes: {e}")
        return jsonify({'error': 'Failed to fetch quotes'}), 500

@app.route('/api/quotes', methods=['POST'])
def create_quote():
    try:
        data = request.json
        last_quote = Quote.query.order_by(Quote.id.desc()).first()
        next_id = (last_quote.id if last_quote else 0) + 1
        quote_num = f"COT-2024-{str(next_id).zfill(3)}"
        
        quote = Quote(
            quote_number=quote_num,
            client_id=data.get('clientId'),
            lead_name=data.get('leadName'),
            lead_contact=data.get('leadContact'),
            items_summary=data.get('itemsSummary'),
            total_value=data.get('totalValue'),
            status=data.get('status', 'Rascunho')
        )
        db.session.add(quote)
        db.session.commit()
        return jsonify({'id': quote.id, 'quoteNumber': quote_num, 'message': 'Cotação criada com sucesso'}), 201
    except Exception as e:
        print(f"Error creating quote: {e}")
        db.session.rollback()
        return jsonify({'error': 'Failed to create quote'}), 500

@app.route('/api/orders', methods=['GET'])
def get_orders():
    try:
        orders = Order.query.all()
        result = []
        for o in orders:
            result.append({
                'id': o.id,
                'orderNumber': o.order_number,
                'clientName': o.client.name if o.client else '',
                'itemsSummary': o.items_summary,
                'totalValue': float(o.total_value) if o.total_value else 0,
                'deliveryDate': o.delivery_date.strftime('%d/%m/%Y') if o.delivery_date else None,
                'stage': o.stage,
                'progress': o.progress,
                'priority': o.priority
            })
        return jsonify(result)
    except Exception as e:
        print(f"Error fetching orders: {e}")
        return jsonify({'error': 'Failed to fetch orders'}), 500

@app.route('/api/orders', methods=['POST'])
def create_order():
    try:
        data = request.json
        last_order = Order.query.order_by(Order.id.desc()).first()
        next_id = (last_order.id if last_order else 0) + 1
        order_num = f"PED-{1024 + next_id}"
        
        delivery_date = None
        if data.get('deliveryDate'):
            try:
                delivery_date = datetime.strptime(data['deliveryDate'], '%Y-%m-%d').date()
            except:
                pass
        
        order = Order(
            order_number=order_num,
            quote_id=data.get('quoteId'),
            client_id=data.get('clientId'),
            items_summary=data.get('itemsSummary'),
            total_value=data.get('totalValue'),
            delivery_date=delivery_date,
            stage=data.get('stage', 'Aguardando'),
            progress=data.get('progress', 0),
            priority=data.get('priority', 'Normal')
        )
        db.session.add(order)
        db.session.commit()
        return jsonify({'id': order.id, 'orderNumber': order_num, 'message': 'Pedido criado com sucesso'}), 201
    except Exception as e:
        print(f"Error creating order: {e}")
        db.session.rollback()
        return jsonify({'error': 'Failed to create order'}), 500

@app.route('/api/transactions', methods=['GET'])
def get_transactions():
    try:
        transactions = Transaction.query.order_by(Transaction.transaction_date.desc()).all()
        return jsonify([{
            'id': t.id,
            'transactionNumber': t.transaction_number,
            'description': t.description,
            'category': t.category,
            'type': t.type,
            'amount': float(t.amount) if t.amount else 0,
            'status': t.status,
            'date': t.transaction_date.strftime('%d/%m/%Y') if t.transaction_date else ''
        } for t in transactions])
    except Exception as e:
        print(f"Error fetching transactions: {e}")
        return jsonify({'error': 'Failed to fetch transactions'}), 500

@app.route('/api/transactions', methods=['POST'])
def create_transaction():
    try:
        data = request.json
        last_trx = Transaction.query.order_by(Transaction.id.desc()).first()
        next_id = (last_trx.id if last_trx else 0) + 1
        trx_num = f"TRX-{9800 + next_id}"
        
        transaction_date = None
        if data.get('transactionDate'):
            try:
                transaction_date = datetime.strptime(data['transactionDate'], '%Y-%m-%d').date()
            except:
                transaction_date = date.today()
        else:
            transaction_date = date.today()
        
        transaction = Transaction(
            transaction_number=trx_num,
            order_id=data.get('orderId'),
            description=data.get('description'),
            category=data.get('category'),
            type=data.get('type'),
            amount=data.get('amount'),
            status=data.get('status', 'Pendente'),
            transaction_date=transaction_date
        )
        db.session.add(transaction)
        db.session.commit()
        return jsonify({'id': transaction.id, 'transactionNumber': trx_num, 'message': 'Transação criada com sucesso'}), 201
    except Exception as e:
        print(f"Error creating transaction: {e}")
        db.session.rollback()
        return jsonify({'error': 'Failed to create transaction'}), 500

@app.route('/api/dashboard/stats', methods=['GET'])
def get_dashboard_stats():
    try:
        revenue_result = db.session.execute(text(
            "SELECT COALESCE(SUM(CASE WHEN type = 'income' AND status = 'Confirmado' THEN amount ELSE 0 END), 0) as total FROM transactions"
        )).fetchone()
        total_revenue = float(revenue_result[0]) if revenue_result else 0
        
        pending_quotes = Quote.query.filter_by(status='Pendente').count()
        
        orders_in_production = Order.query.filter(
            Order.stage.in_(['Corte', 'Estampa', 'Costura', 'Acabamento'])
        ).count()
        
        total_clients = Client.query.count()
        
        return jsonify({
            'totalRevenue': total_revenue,
            'pendingQuotes': pending_quotes,
            'ordersInProduction': orders_in_production,
            'totalClients': total_clients
        })
    except Exception as e:
        print(f"Error fetching dashboard stats: {e}")
        return jsonify({'error': 'Failed to fetch dashboard stats'}), 500

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    return send_from_directory(app.static_folder, 'index.html')

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)
