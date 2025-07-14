#!/usr/bin/env python3
"""
Extract and structure website content for AI responses
This script creates a comprehensive knowledge base from your website
"""

import sys
import os
import json
sys.path.append('chat_backend')

from website_indexer import WebsiteIndexer
from pathlib import Path

def extract_comprehensive_content():
    """Extract all website content and create structured knowledge base"""
    
    print("🔍 Extracting comprehensive website content...")
    
    # Initialize indexer
    indexer = WebsiteIndexer("./")
    
    # Index the website
    count = indexer.index_website()
    print(f"✅ Indexed {count} pages")
    
    # Create structured knowledge base
    knowledge_base = {
        "company_info": {
            "name": "IndustryHub",
            "description": "ERP platform providing tailored solutions for various industries"
        },
        "industries": {},
        "modules": {},
        "pages": []
    }
    
    # Extract industry information
    industries_data = {
        "education": {
            "name": "Education",
            "description": "Solutions for schools, universities, and educational institutions",
            "icon": "🎓"
        },
        "manufacturing": {
            "name": "Manufacturing",
            "description": "Industrial solutions for production and manufacturing processes",
            "icon": "🏭"
        },
        "retail": {
            "name": "Retail", 
            "description": "Comprehensive retail management and customer engagement tools",
            "icon": "🛒"
        },
        "food-beverage": {
            "name": "Food & Beverage",
            "description": "Restaurant, catering, and food service management solutions",
            "icon": "🍽️"
        },
        "textile": {
            "name": "Textile",
            "description": "Fashion, apparel, and textile industry management systems",
            "icon": "👕"
        },
        "healthcare": {
            "name": "Healthcare",
            "description": "Medical and healthcare management solutions for providers",
            "icon": "❤️"
        }
    }
    
    knowledge_base["industries"] = industries_data
    
    # Extract module information
    modules_data = {
        "manufacturing": [
            {"id": 1, "name": "Production Planning", "description": "Plan and schedule manufacturing operations", "icon": "📋"},
            {"id": 2, "name": "Inventory Management", "description": "Track raw materials and finished goods", "icon": "📦"},
            {"id": 3, "name": "Quality Control", "description": "Monitor and ensure product quality standards", "icon": "✅"},
            {"id": 4, "name": "Equipment Maintenance", "description": "Schedule and track machinery maintenance", "icon": "🔧"},
            {"id": 5, "name": "Supply Chain Management", "description": "Manage suppliers and procurement", "icon": "🚚"},
            {"id": 6, "name": "Cost Analysis", "description": "Analyze production costs and efficiency", "icon": "💰"},
            {"id": 7, "name": "Worker Safety", "description": "Ensure workplace safety and compliance", "icon": "🦺"},
            {"id": 8, "name": "Order Management", "description": "Handle customer orders and delivery", "icon": "📝"},
            {"id": 9, "name": "Compliance Tracking", "description": "Ensure regulatory compliance", "icon": "📊"},
            {"id": 10, "name": "Workforce Management", "description": "Manage staff schedules and productivity", "icon": "👥"}
        ],
        "healthcare": [
            {"id": 1, "name": "Patient Records", "description": "Electronic health records and patient management", "icon": "📋"},
            {"id": 2, "name": "Appointment Scheduling", "description": "Book and manage patient appointments", "icon": "📅"},
            {"id": 3, "name": "Billing & Insurance", "description": "Handle medical billing and insurance claims", "icon": "💳"},
            {"id": 4, "name": "Prescription Management", "description": "Manage prescriptions and medication tracking", "icon": "💊"},
            {"id": 5, "name": "Lab Results", "description": "Track and manage laboratory test results", "icon": "🧪"},
            {"id": 6, "name": "Staff Management", "description": "Manage healthcare staff schedules and credentials", "icon": "👩‍⚕️"},
            {"id": 7, "name": "Inventory Management", "description": "Track medical supplies and equipment", "icon": "📦"},
            {"id": 8, "name": "Telemedicine", "description": "Virtual consultations and remote care", "icon": "💻"},
            {"id": 9, "name": "Compliance Tracking", "description": "Ensure HIPAA and regulatory compliance", "icon": "✅"},
            {"id": 10, "name": "Emergency Management", "description": "Handle emergency cases and protocols", "icon": "🚨"}
        ],
        "retail": [
            {"id": 1, "name": "Point of Sale (POS)", "description": "Complete checkout and payment processing", "icon": "💳"},
            {"id": 2, "name": "Inventory Management", "description": "Track stock levels and product movement", "icon": "📦"},
            {"id": 3, "name": "Customer Management", "description": "Manage customer profiles and loyalty programs", "icon": "👥"},
            {"id": 4, "name": "Sales Analytics", "description": "Analyze sales trends and performance", "icon": "📊"},
            {"id": 5, "name": "E-commerce Integration", "description": "Connect online and offline sales channels", "icon": "🌐"},
            {"id": 6, "name": "Staff Management", "description": "Manage employee schedules and performance", "icon": "👤"},
            {"id": 7, "name": "Supplier Management", "description": "Handle vendor relationships and orders", "icon": "🚚"},
            {"id": 8, "name": "Promotions & Discounts", "description": "Create and manage promotional campaigns", "icon": "🏷️"},
            {"id": 9, "name": "Financial Reporting", "description": "Generate financial reports and insights", "icon": "💰"},
            {"id": 10, "name": "Multi-Store Management", "description": "Manage multiple retail locations", "icon": "🏪"}
        ]
    }
    
    knowledge_base["modules"] = modules_data
    
    # Get all indexed pages
    import sqlite3
    conn = sqlite3.connect(indexer.db_path)
    cursor = conn.cursor()
    
    cursor.execute('SELECT url_path, title, content, page_type FROM pages')
    pages = cursor.fetchall()
    
    for page in pages:
        knowledge_base["pages"].append({
            "url": page[0],
            "title": page[1],
            "content": page[2][:500] + "..." if len(page[2]) > 500 else page[2],
            "type": page[3]
        })
    
    conn.close()
    
    # Save knowledge base
    with open('website_knowledge_base.json', 'w', encoding='utf-8') as f:
        json.dump(knowledge_base, f, indent=2, ensure_ascii=False)
    
    print(f"✅ Created knowledge base with:")
    print(f"   - {len(knowledge_base['industries'])} industries")
    print(f"   - {sum(len(modules) for modules in knowledge_base['modules'].values())} total modules")
    print(f"   - {len(knowledge_base['pages'])} pages")
    
    return knowledge_base

def create_ai_context_summary():
    """Create a summary for AI context"""
    
    knowledge_base = extract_comprehensive_content()
    
    summary = """
INDUSTRYHUB PLATFORM INFORMATION

COMPANY: IndustryHub - ERP platform providing tailored solutions for various industries

AVAILABLE INDUSTRIES:
• Education 🎓 - Solutions for schools, universities, and educational institutions
• Manufacturing 🏭 - Industrial solutions for production and manufacturing processes  
• Retail 🛒 - Comprehensive retail management and customer engagement tools
• Food & Beverage 🍽️ - Restaurant, catering, and food service management solutions
• Textile 👕 - Fashion, apparel, and textile industry management systems
• Healthcare ❤️ - Medical and healthcare management solutions for providers

MANUFACTURING MODULES (10 available):
1. Production Planning 📋 - Plan and schedule manufacturing operations
2. Inventory Management 📦 - Track raw materials and finished goods
3. Quality Control ✅ - Monitor and ensure product quality standards
4. Equipment Maintenance 🔧 - Schedule and track machinery maintenance
5. Supply Chain Management 🚚 - Manage suppliers and procurement
6. Cost Analysis 💰 - Analyze production costs and efficiency
7. Worker Safety 🦺 - Ensure workplace safety and compliance
8. Order Management 📝 - Handle customer orders and delivery
9. Compliance Tracking 📊 - Ensure regulatory compliance
10. Workforce Management 👥 - Manage staff schedules and productivity

HEALTHCARE MODULES (10 available):
1. Patient Records 📋 - Electronic health records and patient management
2. Appointment Scheduling 📅 - Book and manage patient appointments
3. Billing & Insurance 💳 - Handle medical billing and insurance claims
4. Prescription Management 💊 - Manage prescriptions and medication tracking
5. Lab Results 🧪 - Track and manage laboratory test results
6. Staff Management 👩‍⚕️ - Manage healthcare staff schedules and credentials
7. Inventory Management 📦 - Track medical supplies and equipment
8. Telemedicine 💻 - Virtual consultations and remote care
9. Compliance Tracking ✅ - Ensure HIPAA and regulatory compliance
10. Emergency Management 🚨 - Handle emergency cases and protocols

RETAIL MODULES (10 available):
1. Point of Sale (POS) 💳 - Complete checkout and payment processing
2. Inventory Management 📦 - Track stock levels and product movement
3. Customer Management 👥 - Manage customer profiles and loyalty programs
4. Sales Analytics 📊 - Analyze sales trends and performance
5. E-commerce Integration 🌐 - Connect online and offline sales channels
6. Staff Management 👤 - Manage employee schedules and performance
7. Supplier Management 🚚 - Handle vendor relationships and orders
8. Promotions & Discounts 🏷️ - Create and manage promotional campaigns
9. Financial Reporting 💰 - Generate financial reports and insights
10. Multi-Store Management 🏪 - Manage multiple retail locations

PLATFORM FEATURES:
- Industry-specific module selection
- Dashboard interfaces for each industry
- User authentication and management
- Modular architecture allowing custom configurations
- Professional ERP interface design
"""
    
    # Save summary
    with open('ai_context_summary.txt', 'w', encoding='utf-8') as f:
        f.write(summary)
    
    print("✅ Created AI context summary")
    print("📄 Files created:")
    print("   - website_knowledge_base.json (complete data)")
    print("   - ai_context_summary.txt (AI reference)")
    
    return summary

if __name__ == "__main__":
    create_ai_context_summary()
    print("\n🎉 Website content extraction complete!")
    print("\n💡 The AI now has accurate information about:")
    print("   - All 6 available industries")
    print("   - 30 total ERP modules across industries")
    print("   - Exact module names and descriptions")
    print("   - Platform structure and navigation")
