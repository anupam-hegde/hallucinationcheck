"""
Test script to verify URL validation functionality in the agent
"""

import sys
sys.path.append('..')

from agent import extract_urls, check_url_validity, validate_all_urls, verify_url_tool

# Test cases
test_texts = [
    {
        "name": "Valid URLs",
        "text": "Check out https://www.google.com and https://www.github.com for more info.",
        "expected": 2
    },
    {
        "name": "Mix of valid and broken URLs",  
        "text": "Visit https://www.google.com or https://this-definitely-does-not-exist-12345xyz.com/fake",
        "expected": 2
    },
    {
        "name": "URLs with paths",
        "text": "Read more at https://docs.python.org/3/tutorial/ and https://fake-url-that-does-not-exist-999.com/path",
        "expected": 2
    }
]

print("=" * 80)
print("URL VALIDATION TEST SUITE")
print("=" * 80)

for test in test_texts:
    print(f"\n📝 Test: {test['name']}")
    print(f"   Text: {test['text']}")
    print(f"   {'-' * 70}")
    
    # Extract URLs
    urls = extract_urls(test['text'])
    print(f"   📍 Found {len(urls)} URL(s): {urls}")
    
    if len(urls) != test['expected']:
        print(f"   ⚠️  WARNING: Expected {test['expected']} URLs, found {len(urls)}")
    
    # Validate each URL
    for url in urls:
        result = check_url_validity(url)
        
        if result['is_accessible']:
            status = f"✅ ACCESSIBLE (HTTP {result['status_code']})"
            if result.get('redirect_url'):
                status += f"\n      ↳ Redirects to: {result['redirect_url']}"
        elif result['is_valid']:
            status = f"❌ BROKEN (Error: {result.get('error', 'Unknown')})"
        else:
            status = f"⚠️  INVALID ({result.get('error', 'Bad format')})"
        
        print(f"   {status}")
        print(f"      URL: {url}")
        
        # Test the tool function
        tool_result = verify_url_tool(url)
        print(f"      Tool Output: {tool_result[:100]}...")
    
print("\n" + "=" * 80)
print("✅ URL VALIDATION TESTS COMPLETE")
print("=" * 80)

# Test with a real verification scenario
print("\n" + "=" * 80)
print("FULL VERIFICATION TEST")
print("=" * 80)

test_text = """
According to https://www.wikipedia.org, artificial intelligence was invented in 2025.
Check out https://this-is-a-fake-url-that-does-not-exist.com for more details.
The Python programming language documentation can be found at https://docs.python.org/3/.
"""

print(f"\n📄 Text to analyze:\n{test_text}")
print(f"\n{'=' * 80}\n")

url_results = validate_all_urls(test_text)

for i, result in enumerate(url_results, 1):
    print(f"URL {i}: {result['url']}")
    print(f"  Valid: {result['is_valid']}")
    print(f"  Accessible: {result['is_accessible']}")
    if result['status_code']:
        print(f"  Status Code: {result['status_code']}")
    if result['error']:
        print(f"  Error: {result['error']}")
    if result.get('redirect_url'):
        print(f"  Redirects to: {result['redirect_url']}")
    print()

print("=" * 80)
print("✅ ALL TESTS COMPLETED")
print("=" * 80)
