#!/usr/bin/env python3
"""
Script de seed para popular o banco de dados EMUNAH
Execute: python seed_database.py
"""

import os
from datetime import datetime, timedelta
from dotenv import load_dotenv

load_dotenv()

from app import app, db, Client, Supplier, Product, Print, Quote, Order, Transaction

def seed_database():
    with app.app_context():
        # Criar tabelas
        db.create_all()
        
        print("🌱 Iniciando seed do banco de dados EMUNAH...")
        
        # ==================== CLIENTES ====================
        print("👥 Criando clientes...")
        clients = [
            Client(name="Igreja Batista Central", contact="Pastor João Silva", email="contato@ibcentral.org", phone="(11) 98765-4321", address="Rua das Flores, 123 - São Paulo/SP"),
            Client(name="Comunidade Vida Nova", contact="Pr. Carlos Santos", email="carlos@vidanova.org", phone="(11) 97654-3210", address="Av. Brasil, 500 - Campinas/SP"),
            Client(name="Ministério Louvor e Adoração", contact="Líder Maria Costa", email="maria@louvor.com", phone="(21) 98888-7777", address="Rua da Paz, 45 - Rio de Janeiro/RJ"),
            Client(name="Grupo de Jovens Aliança", contact="Diego Oliveira", email="diego@alianca.org", phone="(31) 99999-8888", address="Av. Contorno, 200 - Belo Horizonte/MG"),
            Client(name="Igreja Presbiteriana Renovada", contact="Rev. Paulo Mendes", email="paulo@iprenovada.org", phone="(41) 98765-1234", address="Rua Paraná, 78 - Curitiba/PR"),
        ]
        for client in clients:
            existing = Client.query.filter_by(email=client.email).first()
            if not existing:
                db.session.add(client)
        db.session.commit()
        
        # ==================== FORNECEDORES ====================
        print("🏭 Criando fornecedores...")
        suppliers = [
            Supplier(name="Malhas Premium SP", contact="Roberto Andrade", email="roberto@malhaspremium.com", phone="(11) 3456-7890", category="Tecidos", status="Ativo", rating=5, production_time_days=5),
            Supplier(name="Silk Master", contact="Ana Paula", email="ana@silkmaster.com.br", phone="(11) 2345-6789", category="Estamparia", status="Ativo", rating=5, production_time_days=3),
            Supplier(name="Costura Express", contact="José Lima", email="jose@costuraexpress.com", phone="(11) 3333-4444", category="Confecção", status="Ativo", rating=4, production_time_days=7),
            Supplier(name="Bordados Finos", contact="Clara Mendes", email="clara@bordadosfinos.com", phone="(11) 5555-6666", category="Acabamentos", status="Ativo", rating=5, production_time_days=4),
            Supplier(name="Etiquetas Brasil", contact="Fernando Costa", email="fernando@etiquetasbr.com", phone="(11) 7777-8888", category="Etiquetas", status="Ativo", rating=4, production_time_days=2),
        ]
        for supplier in suppliers:
            existing = Supplier.query.filter_by(email=supplier.email).first()
            if not existing:
                db.session.add(supplier)
        db.session.commit()
        
        # ==================== PRODUTOS ====================
        print("👕 Criando produtos...")
        products = [
            Product(name="Camiseta Básica Algodão", sku="CAM-BAS-001", category="Camisetas", price=49.90, cost=22.00, stock=150, colors=["Branco", "Preto", "Cinza", "Azul Marinho"], sizes=["P", "M", "G", "GG"]),
            Product(name="Baby Look Premium", sku="BAB-PRE-001", category="Baby Look", price=54.90, cost=25.00, stock=100, colors=["Branco", "Preto", "Rosa", "Azul"], sizes=["P", "M", "G", "GG"]),
            Product(name="Camiseta Manga Longa", sku="CAM-LNG-001", category="Camisetas", price=69.90, cost=32.00, stock=80, colors=["Branco", "Preto", "Cinza"], sizes=["P", "M", "G", "GG"]),
            Product(name="Moletom Canguru", sku="MOL-CAN-001", category="Inverno", price=129.90, cost=58.00, stock=50, colors=["Preto", "Cinza Mescla", "Azul Marinho"], sizes=["P", "M", "G", "GG", "XGG"]),
            Product(name="Regata Fitness", sku="REG-FIT-001", category="Fitness", price=44.90, cost=18.00, stock=120, colors=["Branco", "Preto", "Rosa", "Azul"], sizes=["P", "M", "G", "GG"]),
            Product(name="Polo Bordada", sku="POL-BOR-001", category="Polo", price=89.90, cost=42.00, stock=60, colors=["Branco", "Preto", "Azul Royal"], sizes=["P", "M", "G", "GG"]),
        ]
        for product in products:
            existing = Product.query.filter_by(sku=product.sku).first()
            if not existing:
                db.session.add(product)
        db.session.commit()
        
        # ==================== ESTAMPAS ====================
        print("🎨 Criando estampas...")
        prints = [
            Print(name="Salmo 23", technique="Silk Screen", colors="2", image_url="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300", image_type="url", tags=["salmos", "paz", "clássico"]),
            Print(name="Cruz Minimalista", technique="DTG", colors="Full Color", image_url="https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=300", image_type="url", tags=["cruz", "moderno", "minimalista"]),
            Print(name="Jesus Loves You", technique="Transfer", colors="3", image_url="https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=300", image_type="url", tags=["amor", "jesus", "inglês"]),
            Print(name="Versículo João 3:16", technique="Silk Screen", colors="1", image_url="https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=300", image_type="url", tags=["versículo", "joão", "clássico"]),
            Print(name="Adoração Contemporânea", technique="DTG", colors="Full Color", image_url="https://images.unsplash.com/photo-1478147427282-58a87a120781?w=300", image_type="url", tags=["adoração", "louvor", "moderno"]),
            Print(name="Fé Tipográfica", technique="Silk Screen", colors="1", image_url="https://images.unsplash.com/photo-1519681393784-d120267933ba?w=300", image_type="url", tags=["fé", "tipografia", "minimalista"]),
        ]
        for p in prints:
            existing = Print.query.filter_by(name=p.name).first()
            if not existing:
                db.session.add(p)
        db.session.commit()
        
        # ==================== COTAÇÕES ====================
        print("📋 Criando cotações...")
        clients_db = Client.query.all()
        quotes = [
            Quote(quote_number="COT-2024-001", client_id=clients_db[0].id if clients_db else None, lead_name="Igreja Batista Central", items_summary="50x Camiseta Salmo 23 (P-GG)", total_value=2495.00, status="Aprovada"),
            Quote(quote_number="COT-2024-002", client_id=clients_db[1].id if len(clients_db) > 1 else None, lead_name="Comunidade Vida Nova", items_summary="100x Baby Look Cruz Minimalista", total_value=5490.00, status="Pendente"),
            Quote(quote_number="COT-2024-003", client_id=None, lead_name="Pr. Marcos Silva", lead_contact="(11) 99999-0000", items_summary="30x Moletom Personalizado", total_value=3897.00, status="Enviada"),
            Quote(quote_number="COT-2024-004", client_id=clients_db[2].id if len(clients_db) > 2 else None, lead_name="Ministério Louvor", items_summary="80x Camiseta Adoração + 40x Regata", total_value=5788.00, status="Rascunho"),
        ]
        for quote in quotes:
            existing = Quote.query.filter_by(quote_number=quote.quote_number).first()
            if not existing:
                db.session.add(quote)
        db.session.commit()
        
        # ==================== PEDIDOS ====================
        print("📦 Criando pedidos...")
        orders = [
            Order(order_number="PED-1024", quote_id=1, client_id=clients_db[0].id if clients_db else 1, items_summary="50x Camiseta Salmo 23", total_value=2495.00, delivery_date=datetime.now().date() + timedelta(days=10), stage="Estampa", progress=45, priority="Normal"),
            Order(order_number="PED-1025", quote_id=None, client_id=clients_db[1].id if len(clients_db) > 1 else 1, items_summary="100x Baby Look Cruz Minimalista", total_value=5490.00, delivery_date=datetime.now().date() + timedelta(days=15), stage="Corte", progress=20, priority="Alta"),
            Order(order_number="PED-1026", quote_id=None, client_id=clients_db[2].id if len(clients_db) > 2 else 1, items_summary="200x Camiseta Evento Jovens", total_value=9980.00, delivery_date=datetime.now().date() + timedelta(days=5), stage="Acabamento", progress=85, priority="Urgente"),
            Order(order_number="PED-1027", quote_id=None, client_id=clients_db[0].id if clients_db else 1, items_summary="30x Polo Bordada", total_value=2697.00, delivery_date=datetime.now().date() + timedelta(days=20), stage="Aguardando", progress=0, priority="Normal"),
        ]
        for order in orders:
            existing = Order.query.filter_by(order_number=order.order_number).first()
            if not existing:
                db.session.add(order)
        db.session.commit()
        
        # ==================== TRANSAÇÕES ====================
        print("💰 Criando transações...")
        transactions = [
            Transaction(transaction_number="TRX-9801", order_id=1, description="Pagamento Pedido PED-1024 - Igreja Batista", category="Vendas", type="income", amount=2495.00, status="Confirmado", transaction_date=datetime.now().date() - timedelta(days=5)),
            Transaction(transaction_number="TRX-9802", order_id=None, description="Compra Tecido Malha - Malhas Premium", category="Matéria Prima", type="expense", amount=1850.00, status="Confirmado", transaction_date=datetime.now().date() - timedelta(days=3)),
            Transaction(transaction_number="TRX-9803", order_id=2, description="Sinal Pedido PED-1025 - 50%", category="Vendas", type="income", amount=2745.00, status="Confirmado", transaction_date=datetime.now().date() - timedelta(days=2)),
            Transaction(transaction_number="TRX-9804", order_id=None, description="Pagamento Fornecedor Silk Master", category="Matéria Prima", type="expense", amount=980.00, status="Pendente", transaction_date=datetime.now().date() + timedelta(days=5)),
            Transaction(transaction_number="TRX-9805", order_id=3, description="Pagamento Completo PED-1026", category="Vendas", type="income", amount=9980.00, status="Agendado", transaction_date=datetime.now().date() + timedelta(days=7)),
            Transaction(transaction_number="TRX-9806", order_id=None, description="Aluguel Galpão Dezembro", category="Despesas Fixas", type="expense", amount=3500.00, status="Pendente", transaction_date=datetime.now().date() + timedelta(days=10)),
            Transaction(transaction_number="TRX-9807", order_id=None, description="Manutenção Máquina Silk", category="Manutenção", type="expense", amount=450.00, status="Confirmado", transaction_date=datetime.now().date() - timedelta(days=1)),
        ]
        for trx in transactions:
            existing = Transaction.query.filter_by(transaction_number=trx.transaction_number).first()
            if not existing:
                db.session.add(trx)
        db.session.commit()
        
        print("\n✅ Seed concluído com sucesso!")
        print(f"   - {Client.query.count()} clientes")
        print(f"   - {Supplier.query.count()} fornecedores")
        print(f"   - {Product.query.count()} produtos")
        print(f"   - {Print.query.count()} estampas")
        print(f"   - {Quote.query.count()} cotações")
        print(f"   - {Order.query.count()} pedidos")
        print(f"   - {Transaction.query.count()} transações")

if __name__ == "__main__":
    seed_database()
