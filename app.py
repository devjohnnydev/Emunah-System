from flask import Flask, request, jsonify, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from datetime import datetime
from werkzeug.utils import secure_filename
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__, static_folder='dist/public', static_url_path='')
CORS(app)

# Database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size

db = SQLAlchemy(app)
migrate = Migrate(app, db)

# Ensure upload directory exists
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
os.makedirs(os.path.join(app.config['UPLOAD_FOLDER'], 'prints'), exist_ok=True)

# ==================== MODELS ====================

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    phone = db.Column(db.String(20))
    role = db.Column(db.String(20), default='SELLER')  # ADMIN, SELLER, SUPPLIER
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Client(db.Model):
    __tablename__ = 'clients'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    contact = db.Column(db.String(100))
    email = db.Column(db.String(120))
    phone = db.Column(db.String(20))
    address = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Supplier(db.Model):
    __tablename__ = 'suppliers'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    contact = db.Column(db.String(100))
    email = db.Column(db.String(120))
    phone = db.Column(db.String(20))
    category = db.Column(db.String(50))  # Tecidos, Estamparia, Acabamentos, etc
    status = db.Column(db.String(20), default='Ativo')  # Ativo, Inativo
    rating = db.Column(db.Integer, default=5)
    production_time_days = db.Column(db.Integer, default=7)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Product(db.Model):
    __tablename__ = 'products'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    sku = db.Column(db.String(50), unique=True, nullable=False)
    category = db.Column(db.String(50))  # Camisetas, Baby Look, Inverno, etc
    price = db.Column(db.Numeric(10, 2), nullable=False)
    cost = db.Column(db.Numeric(10, 2), nullable=False)
    stock = db.Column(db.Integer, default=0)
    colors = db.Column(db.JSON)  # Array de cores
    sizes = db.Column(db.JSON)   # Array de tamanhos
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Print(db.Model):
    __tablename__ = 'prints'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    technique = db.Column(db.String(50))  # Silk Screen, DTG, Transfer
    colors = db.Column(db.String(50))  # "1", "2", "Full Color"
    image_url = db.Column(db.String(500))  # URL externa ou caminho local
    image_type = db.Column(db.String(10), default='url')  # 'url' ou 'local'
    tags = db.Column(db.JSON)  # Array de tags
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Quote(db.Model):
    __tablename__ = 'quotes'
    id = db.Column(db.Integer, primary_key=True)
    quote_number = db.Column(db.String(50), unique=True, nullable=False)
    client_id = db.Column(db.Integer, db.ForeignKey('clients.id'), nullable=True)
    lead_name = db.Column(db.String(100))  # Para cotações sem cliente cadastrado
    lead_contact = db.Column(db.String(100))
    items_summary = db.Column(db.Text)
    total_value = db.Column(db.Numeric(10, 2), nullable=False)
    status = db.Column(db.String(20), default='Rascunho')  # Rascunho, Pendente, Enviada, Aprovada, Rejeitada
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    client = db.relationship('Client', backref='quotes')

class Order(db.Model):
    __tablename__ = 'orders'
    id = db.Column(db.Integer, primary_key=True)
    order_number = db.Column(db.String(50), unique=True, nullable=False)
    quote_id = db.Column(db.Integer, db.ForeignKey('quotes.id'), nullable=True)
    client_id = db.Column(db.Integer, db.ForeignKey('clients.id'), nullable=False)
    items_summary = db.Column(db.Text)
    total_value = db.Column(db.Numeric(10, 2), nullable=False)
    delivery_date = db.Column(db.Date)
    stage = db.Column(db.String(30), default='Aguardando')  # Aguardando, Corte, Estampa, Costura, Acabamento, Qualidade, Concluído
    progress = db.Column(db.Integer, default=0)  # 0-100
    priority = db.Column(db.String(20), default='Normal')  # Normal, Alta, Urgente
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    client = db.relationship('Client', backref='orders')
    quote = db.relationship('Quote', backref='orders')

class Transaction(db.Model):
    __tablename__ = 'transactions'
    id = db.Column(db.Integer, primary_key=True)
    transaction_number = db.Column(db.String(50), unique=True, nullable=False)
    order_id = db.Column(db.Integer, db.ForeignKey('orders.id'), nullable=True)
    description = db.Column(db.Text, nullable=False)
    category = db.Column(db.String(50))  # Vendas, Matéria Prima, Manutenção, Despesas Fixas
    type = db.Column(db.String(10), nullable=False)  # income, expense
    amount = db.Column(db.Numeric(10, 2), nullable=False)
    status = db.Column(db.String(20), default='Pendente')  # Pendente, Confirmado, Agendado
    transaction_date = db.Column(db.Date, default=datetime.utcnow)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    order = db.relationship('Order', backref='transactions')

# ==================== ROUTES ====================

# Serve React App
@app.route('/')
@app.route('/<path:path>')
def serve_react(path=''):
    if path and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    return send_from_directory(app.static_folder, 'index.html')

# Health check
@app.route('/api/health')
def health():
    return jsonify({'status': 'ok'})

# ==================== CLIENTS ====================
@app.route('/api/clients', methods=['GET'])
def get_clients():
    clients = Client.query.all()
    return jsonify([{
        'id': c.id,
        'name': c.name,
        'contact': c.contact,
        'email': c.email,
        'phone': c.phone,
        'address': c.address
    } for c in clients])

@app.route('/api/clients', methods=['POST'])
def create_client():
    data = request.json
    client = Client(
        name=data['name'],
        contact=data.get('contact'),
        email=data.get('email'),
        phone=data.get('phone'),
        address=data.get('address')
    )
    db.session.add(client)
    db.session.commit()
    return jsonify({'id': client.id, 'message': 'Cliente criado com sucesso'}), 201

# ==================== SUPPLIERS ====================
@app.route('/api/suppliers', methods=['GET'])
def get_suppliers():
    suppliers = Supplier.query.all()
    return jsonify([{
        'id': s.id,
        'name': s.name,
        'contact': s.contact,
        'email': s.email,
        'phone': s.phone,
        'category': s.category,
        'status': s.status,
        'rating': s.rating
    } for s in suppliers])

@app.route('/api/suppliers', methods=['POST'])
def create_supplier():
    data = request.json
    supplier = Supplier(
        name=data['name'],
        contact=data.get('contact'),
        email=data.get('email'),
        phone=data.get('phone'),
        category=data.get('category'),
        status=data.get('status', 'Ativo'),
        rating=data.get('rating', 5)
    )
    db.session.add(supplier)
    db.session.commit()
    return jsonify({'id': supplier.id, 'message': 'Fornecedor criado com sucesso'}), 201

# ==================== PRODUCTS ====================
@app.route('/api/products', methods=['GET'])
def get_products():
    products = Product.query.all()
    return jsonify([{
        'id': p.id,
        'name': p.name,
        'sku': p.sku,
        'category': p.category,
        'price': float(p.price),
        'cost': float(p.cost),
        'stock': p.stock,
        'colors': p.colors,
        'sizes': p.sizes
    } for p in products])

@app.route('/api/products', methods=['POST'])
def create_product():
    data = request.json
    product = Product(
        name=data['name'],
        sku=data['sku'],
        category=data.get('category'),
        price=data['price'],
        cost=data['cost'],
        stock=data.get('stock', 0),
        colors=data.get('colors', []),
        sizes=data.get('sizes', [])
    )
    db.session.add(product)
    db.session.commit()
    return jsonify({'id': product.id, 'message': 'Produto criado com sucesso'}), 201

# ==================== PRINTS ====================
@app.route('/api/prints', methods=['GET'])
def get_prints():
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

@app.route('/api/prints', methods=['POST'])
def create_print():
    data = request.json
    print_item = Print(
        name=data['name'],
        technique=data.get('technique'),
        colors=data.get('colors'),
        image_url=data.get('imageUrl'),
        image_type=data.get('imageType', 'url'),
        tags=data.get('tags', [])
    )
    db.session.add(print_item)
    db.session.commit()
    return jsonify({'id': print_item.id, 'message': 'Estampa criada com sucesso'}), 201

@app.route('/api/prints/upload', methods=['POST'])
def upload_print():
    if 'file' not in request.files:
        return jsonify({'error': 'Nenhum arquivo enviado'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'Nome de arquivo inválido'}), 400
    
    filename = secure_filename(file.filename)
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    filename = f"{timestamp}_{filename}"
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], 'prints', filename)
    file.save(filepath)
    
    return jsonify({'url': f'/uploads/prints/{filename}'}), 200

# ==================== QUOTES ====================
@app.route('/api/quotes', methods=['GET'])
def get_quotes():
    quotes = Quote.query.all()
    return jsonify([{
        'id': q.id,
        'quoteNumber': q.quote_number,
        'clientId': q.client_id,
        'clientName': q.client.name if q.client else q.lead_name,
        'contact': q.client.contact if q.client else q.lead_contact,
        'itemsSummary': q.items_summary,
        'totalValue': float(q.total_value),
        'status': q.status,
        'date': q.created_at.strftime('%d/%m/%Y')
    } for q in quotes])

@app.route('/api/quotes', methods=['POST'])
def create_quote():
    data = request.json
    # Generate quote number
    last_quote = Quote.query.order_by(Quote.id.desc()).first()
    quote_num = f"COT-2024-{str((last_quote.id + 1) if last_quote else 1).zfill(3)}"
    
    quote = Quote(
        quote_number=quote_num,
        client_id=data.get('clientId'),
        lead_name=data.get('leadName'),
        lead_contact=data.get('leadContact'),
        items_summary=data['itemsSummary'],
        total_value=data['totalValue'],
        status=data.get('status', 'Rascunho')
    )
    db.session.add(quote)
    db.session.commit()
    return jsonify({'id': quote.id, 'quoteNumber': quote_num, 'message': 'Cotação criada com sucesso'}), 201

# ==================== ORDERS ====================
@app.route('/api/orders', methods=['GET'])
def get_orders():
    orders = Order.query.all()
    return jsonify([{
        'id': o.id,
        'orderNumber': o.order_number,
        'clientName': o.client.name,
        'itemsSummary': o.items_summary,
        'totalValue': float(o.total_value),
        'deliveryDate': o.delivery_date.strftime('%d/%m/%Y') if o.delivery_date else None,
        'stage': o.stage,
        'progress': o.progress,
        'priority': o.priority
    } for o in orders])

@app.route('/api/orders', methods=['POST'])
def create_order():
    data = request.json
    # Generate order number
    last_order = Order.query.order_by(Order.id.desc()).first()
    order_num = f"PED-{1024 + ((last_order.id) if last_order else 0)}"
    
    order = Order(
        order_number=order_num,
        quote_id=data.get('quoteId'),
        client_id=data['clientId'],
        items_summary=data['itemsSummary'],
        total_value=data['totalValue'],
        delivery_date=datetime.strptime(data['deliveryDate'], '%Y-%m-%d') if data.get('deliveryDate') else None,
        stage=data.get('stage', 'Aguardando'),
        progress=data.get('progress', 0),
        priority=data.get('priority', 'Normal')
    )
    db.session.add(order)
    db.session.commit()
    return jsonify({'id': order.id, 'orderNumber': order_num, 'message': 'Pedido criado com sucesso'}), 201

# ==================== TRANSACTIONS ====================
@app.route('/api/transactions', methods=['GET'])
def get_transactions():
    transactions = Transaction.query.order_by(Transaction.transaction_date.desc()).all()
    return jsonify([{
        'id': t.id,
        'transactionNumber': t.transaction_number,
        'description': t.description,
        'category': t.category,
        'type': t.type,
        'amount': float(t.amount),
        'status': t.status,
        'date': t.transaction_date.strftime('%d/%m/%Y')
    } for t in transactions])

@app.route('/api/transactions', methods=['POST'])
def create_transaction():
    data = request.json
    # Generate transaction number
    last_trx = Transaction.query.order_by(Transaction.id.desc()).first()
    trx_num = f"TRX-{9800 + ((last_trx.id) if last_trx else 0)}"
    
    transaction = Transaction(
        transaction_number=trx_num,
        order_id=data.get('orderId'),
        description=data['description'],
        category=data.get('category'),
        type=data['type'],
        amount=data['amount'],
        status=data.get('status', 'Pendente'),
        transaction_date=datetime.strptime(data['date'], '%Y-%m-%d') if data.get('date') else datetime.utcnow()
    )
    db.session.add(transaction)
    db.session.commit()
    return jsonify({'id': transaction.id, 'transactionNumber': trx_num, 'message': 'Transação criada com sucesso'}), 201

# ==================== DASHBOARD STATS ====================
@app.route('/api/dashboard/stats', methods=['GET'])
def get_dashboard_stats():
    # Calculate statistics
    total_revenue = db.session.query(db.func.sum(Transaction.amount)).filter(
        Transaction.type == 'income',
        Transaction.status == 'Confirmado'
    ).scalar() or 0
    
    pending_quotes = Quote.query.filter_by(status='Pendente').count()
    orders_in_production = Order.query.filter(Order.stage.in_(['Corte', 'Estampa', 'Costura', 'Acabamento'])).count()
    total_clients = Client.query.count()
    
    return jsonify({
        'totalRevenue': float(total_revenue),
        'pendingQuotes': pending_quotes,
        'ordersInProduction': orders_in_production,
        'totalClients': total_clients
    })

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(host='0.0.0.0', port=5000, debug=True)
