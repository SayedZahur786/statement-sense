import {test} from 'node:test';import assert from 'node:assert/strict';import {boundedBody} from '../lib/body';
test('actual body limit does not trust declared content length',async()=>{const request=new Request('http://localhost/',{method:'POST',headers:{'content-length':'1'},body:'123456789'});await assert.rejects(()=>boundedBody(request,4));});
test('bounded body preserves bytes',async()=>{assert.equal(new TextDecoder().decode(await boundedBody(new Request('http://localhost/',{method:'POST',body:'abc'}),3)),'abc');});
