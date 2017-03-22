
console.group('Stream');

var Stream = Fn.Stream;

test(' Stream(fn)', function() {
	var i = 0;
	var s = Stream(function oneToFive() {
		return ++i < 5 ? i : undefined ;
	});

	equals(1, s.shift());
	equals(2, s.shift());
	equals(3, s.shift());
	equals(4, s.shift());
	equals(undefined, s.shift());
});

test(' Stream(array)', function() {
	var i = 0;
	var s = Stream([1,2,3,4]);

	equals(1, s.shift());
	equals(2, s.shift());
	equals(3, s.shift());
	equals(4, s.shift());
	equals(undefined, s.shift());
});

test(' Stream.of(...)', function() {
	var i = 0;
	var s = Stream.of(1,2,3,4);

	equals(1, s.shift());
	equals(2, s.shift());
	equals(3, s.shift());
	equals(4, s.shift());
	equals(undefined, s.shift());
});

test('.shift()', function() {
	var i = 0;
	var s = Fn.Stream(function oneToFive() {
		return ++i < 5 ? i : undefined ;
	});

	equals(1, s.shift());
	equals(2, s.shift());
	equals(3, s.shift());
	equals(4, s.shift());
	equals(undefined, s.shift());
});

test('.push()', function() {
	var s = Stream.of(1,2,undefined,3,4);
	var b = [5,6,7];

	equals(1, s.shift());
	equals(2, s.shift());
	equals(3, s.shift());
	equals(4, s.shift());
	equals(undefined, s.shift());

	s.push.apply(s, b);

	equals(5, s.shift());
	equals(6, s.shift());
	equals(7, s.shift());
	equals(undefined, s.shift());
});

test('.clone()', function() {
	var s1 = Stream([0,1,2,3]);
	var s2 = s1.clone();
	var s3 = s1.clone();

	equals('0,1,2,3', s2.toArray().join());
	equals('0,1,2,3', s3.toArray().join());

	s1 = Stream([0,1,2,3]);
	s2 = s1.clone().toArray();
	s3 = s1.clone().toArray();

	equals('0,1,2,3', s2.join());
	equals('0,1,2,3', s3.join());

	var v1, v2, v3;
	s1 = Stream([0,1,2,3]);

	s2 = s1.clone().each(function(value) { v2 = value; });
	s3 = s1.clone().each(function(value) { v3 = value; });
	s1 = s1.each(function(value) { v1 = value; });

	s1.push(4, 5);

	equals(5, v1);
	equals(5, v2);
	equals(5, v3);
});

test('.toArray()', function() {
	var s1 = Fn();
	equals('', s1.toArray().join());

	var s2 = Fn([0,1,2,3]);
	equals( '0,1,2,3', s2.toArray().join());
});

test('.map()', function() {
	var s1 = Fn([0,1,2,3]);
	var s2 = s1.map(Fn.add(1));
	equals('1,2,3,4', s2.toArray().join());
});

test('.reduce()', function() {
	var s = Stream.of(1,0,1,0).reduce(Fn.add, 2);
	equals(4, s.shift());
	equals(undefined, s.shift());
});

test('.pipe()', function() {
	var s1 = Stream.of(0,1,2,3);
	var s2 = s1.pipe(Stream.of());

	equals('0,1,2,3', s2.toArray().join());



	// Pipe multiple

	var s1 = Stream.of(1,2);
	var s2 = Stream.of(3);
	var s3 = Stream.of(0);

	s3.name = 's3';

	var results = [];

	s1.pipe(s3);
	s2.pipe(s3);

	s3.each(function(value) {
		results.push(value);
	});

	equals('0,1,2,3', results.join());

	results = [];

	s1.push(0);
	s1.push(1);
	s1.push(2);
	s1.push(3);

	equals('0,1,2,3', results.join());

	results = [];

	s2.push(0);
	s2.push(1);
	s2.push(2);
	s2.push(3);

	equals('0,1,2,3', results.join());

	results = [];

	s2.push(0);
	s2.push(1);
	s1.push(2);
	s1.push(3);

	equals('0,1,2,3', results.join());

	results = [];

	s2.push(0);
	s1.push(1);
	s2.push(2);
	s1.push(3);

	equals('0,1,2,3', results.join());

	results = [];

	var s4 = Stream.of(0,1);
	s4.pipe(s3);

	s1.push(2);
	s4.push(3);
	s2.push(4);
	s4.push(5);

	equals('0,1,2,3,4,5', results.join());

	
	
	// Pipe then .stop()
	
	var s1 = Stream.of(1,2);
	var s2 = Stream.of(3);
	var s3 = Stream.of(0);

	s3.name = 's3';

	var results = [];

	s1.pipe(s3);
	s2.pipe(s3);

	s3.each(function(value) {
		results.push(value);
	});

	equals('0,1,2,3', results.join());

	results = [];

	s1.push(0);
	s1.push(1);
	s1.stop();
	s1.push(2);
	s1.push(3);

	equals('0,1', results.join());
});

test('.each()', function() {
	var results1 = [];
	var s1 = Stream.of(0,1,2,3).each(function(value) {
		results1.push(value);
	});
	s1.push(4,5);
	equals('0,1,2,3,4,5', results1.join());

//	console.log('pull from a piped stream...');
//	var results2 = [];
//	var s2 = Stream.of(0,1,2,3);
//	var s3 = s2.pipe(Stream.of()).each(function(value) {
//		results2.push(value);
//	});
//	s2.push(4,5);
//	equals('0,1,2,3,4,5', results2.join());
});

test('.group()', function() {
	var s = Stream.of(
		[0, "note", 60, 0.5],
		[1, "note", 60, 0.5],
		[2, "pitch", 1],
		[3, "note", 60, 0.5],
		[4, "pitch", 60],
		[5, "tempo", 120]
	)
	.group(Fn.get(1));

	equals('note,note,note', s.shift().map(Fn.get(1)).toArray().join());
	equals('pitch,pitch', s.shift().map(Fn.get(1)).toArray().join());
	equals('tempo', s.shift().map(Fn.get(1)).toArray().join());
	equals(undefined, s.shift());
});

test('.join()', function() {
	equals('0,0,1,1,1,2,3,3,3,3,3,4,4', Stream.of([0,0,1,1,1],[2,3],[3,3,3,3],[4,4]).join().toArray().join());

	equals('note,note,note,pitch,pitch,tempo',
		Stream.of(
			[0, "note", 60, 0.5],
			[1, "note", 60, 0.5],
			[2, "pitch", 1],
			[3, "note", 60, 0.5],
			[4, "pitch", 60],
			[5, "tempo", 120]
		)
		.group(Fn.get(1))
		.join()
		.map(Fn.get(1))
		.toArray()
		.join()
	);

	var s = Stream.of(0,0,1,2,3,3,2,3,0)
		.group()
		.join();

	equals([0,0,0,1,2,2,3,3,3].join(), s.toArray().join());

	s.push(0,1,2,4,4,4);
	equals([4,4,4].join(), s.toArray().join());

	s.push(0);
	equals(undefined, s.shift());
	s.push(1);
	equals(undefined, s.shift());
	s.push(4);
	equals(undefined, s.shift());

	s.push(7);
	s.push(8);
	s.push(7);
	s.push(8);
	equals([7,7,8,8].join(), s.toArray().join());
});

test('.unique()', function() {
	equals('0,1,2,3,4', Stream.of(0,0,1,1,1,2,3,3,3,3,3,4,4).unique().toArray().join());
});

test('.group().merge()', function() {
	var s = Stream.of(0,0,1,2,3,3,2,3,0)
		.group()
		.merge();

	equals([0,0,1,2,3,3,2,3,0].join(), s.toArray().join());

	s.push(0);
	equals(0, s.shift());
	s.push(1);
	equals(1, s.shift());
	s.push(4);
	equals(4, s.shift());

	s.push(1);
	s.push(2);
	s.push(4);
	s.push(2);
	equals([1,2,4,2].join(), s.toArray().join());

	s.push(0,1,2,4,4,4,2);
	equals([0,1,2,4,4,4,2].join(), s.toArray().join());
});

test('.throttle()', function() {
	console.log('.throttle()');

	(function() {		
		var buffer = Stream.of(0,1,2,3,4,5);
		var i = 0;
		
		buffer
		.throttle()
		.each(function(n) {
			++i;
			equals(5, n);
		});
		
		requestAnimationFrame(function() {
			buffer.push(9);
			buffer.push(19);
			buffer.push(29);
			buffer.push(5);
		});

		setTimeout(function() {
			equals(2, i, 'Test did not complete');
		}, 300);
	})();

	console.log('.throttle(time)');

	(function() {
		var buffer = Stream.of(0,1,2,3,4,5);
		var i = 0;

		buffer
		.throttle(0.3)
		.each(function(n) {
			++i;
			equals(5, n);
		});

		setTimeout(function() {
			buffer.push(9);
			buffer.push(19);
			buffer.push(29);
			buffer.push(5);
		}, 500);

		setTimeout(function() {
			equals(2, i, 'Test did not complete');
		}, 1000);
	})();

	console.log('.throttle(request)');

	(function() {
		var timer  = Fn.Timer(0.5);
		var buffer = Stream.of(0,1,2,3,4,5);
		var i = 0;

		buffer
		.throttle(timer.request)
		.each(function(n) {
			++i;
			equals(5, n);
		});

		timer.request(function() {
			buffer.push(9);
			buffer.push(19);
			buffer.push(29);
			buffer.push(5);
		});

		setTimeout(function() {
			equals(2, i, 'Test did not complete');
		}, 1200);
	})();
});

test('.delay(time)', function() {
	var buffer = Stream.of(0,1,2,3,4,5);
	var i = 0;
	var results = [];

	buffer
	.delay(1)
	.each(function(n) {
		results.push(n);
	});

	buffer.push(6);
	buffer.push(7);
	buffer.push(8);
	buffer.push(9);

	equals(0, i);

	setTimeout(function() {
		equals('0,1,2,3,4,5,6,7,8,9', results.join());
	}, 2000);
});

console.groupEnd();
