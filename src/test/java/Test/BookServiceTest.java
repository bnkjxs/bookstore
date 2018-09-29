package Test;

import java.util.Date;
import java.util.LinkedList;
import java.util.List;

import org.junit.AfterClass;
import org.junit.BeforeClass;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import com.cht.bookstore.entity.Book;
import com.cht.bookstore.service.BookService;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = {"classpath:applicationContext.xml"})
public class BookServiceTest {
	@Autowired
	private BookService bookService;
	
	@BeforeClass
	public static void before(){
		System.out.println("================================");
		System.out.println("   测试前执行...");
		System.out.println("================================");
	}
	
	@AfterClass
	public static void after(){
		System.out.println("================================");
		System.out.println("   测试后执行...");
		System.out.println("================================");
	}
	
	@Test
	public void testGetAllBooks() {
        List<Book> books= bookService.getAllBooks();
        System.out.println(books.size());
    }

//	@Test
//	public void testGetBookById() {
//		Book book= bookService.getBookById(1);
//		System.out.println(book.getTitle());
//	}
	
//	@Test
//	public void testAddBook(){
//		System.out.println("新增前：" + bookService.getAllBooks().size());
//		long start = System.currentTimeMillis();
//		int v = 1000;
//		for (int i = 0; i < v; i++) {
//			Book book = new Book(0,"test"+i, 20.0, new Date());
//			bookService.add(book);
//		}
//		System.out.println("新增后：" + bookService.getAllBooks().size());
//		System.out.println("合计耗时：" + ((System.currentTimeMillis() - start)/1000));
//	}

//	@Test
//	public void testAddBooks(){
//		System.out.println("新增前：" + bookService.getAllBooks().size());
//		long start = System.currentTimeMillis();
//		int v = 10000;
//		List<Book> books = new LinkedList<>();
//		for (int i = 0; i < v; i++) {
//			Book book = new Book(0,"test"+i, 20.0, new Date());
//			books.add(book);
//		}
//		bookService.addBatchs(books);
//		System.out.println("新增后：" + bookService.getAllBooks().size());
//		System.out.println("合计耗时：" + ((System.currentTimeMillis() - start)/1000));
//	}
	
//	@Test
//	public void testUpdateBook(){
//		Book book = new Book(7,"修改测试图书", 10.0, new Date());
//		int num = bookService.update(book);
//		System.out.println("修改数：" + num);
//		System.out.println(bookService.getBookById(book.getId()).getTitle());
//	}
	
//	@Test
//	public void testDeleteBook(){
//		
//		long start = System.currentTimeMillis();
//		System.out.println("删除前：" + bookService.getAllBooks().size());
//		int num = 10000;
//		int startNum = 12011;
//		int v = num+startNum;
//		int[] ids = new int[num];
//		for (int i = startNum; i < v; i++) {
//			ids[i-startNum] = i;
//		}
//		bookService.deleteBatchs(ids);
//		System.out.println("删除后：" + bookService.getAllBooks().size());
//		System.out.println("合计耗时：" + ((System.currentTimeMillis() - start)/1000));
//	}
}
